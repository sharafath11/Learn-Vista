import { injectable, inject } from "inversify";
import { TYPES } from "../../../core/types";
import { IKmatService } from "../../../core/interfaces/services/user/IKmatService";
import { IUserKmatStateRepository } from "../../../core/interfaces/repositories/user/kmat/IUserKmatStateRepository";
import { IKmatDailyDataRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatDailyDataRepository";
import { IKmatQuestionBankRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatQuestionBankRepository";
import { IKmatExamAttemptRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatExamAttemptRepository";
import { IKmatPracticeAttemptRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatPracticeAttemptRepository";
import { IKmatDailyReportRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatDailyReportRepository";
import {
  buildKMATLearnPrompt,
  buildKMATPracticePrompt,
  buildKMATAnalysisPrompt
} from "../../../utils/rportprompt";
import { getAIResponseJSON } from "../../../config/gemaniAi";
import { redis } from "../../../config/redis";
import mongoose from "mongoose";

@injectable()
export class KmatService implements IKmatService {
  constructor(
    @inject(TYPES.UserKmatStateRepository) private stateRepo: IUserKmatStateRepository,
    @inject(TYPES.KmatDailyDataRepository) private dailyDataRepo: IKmatDailyDataRepository,
    @inject(TYPES.KmatQuestionBankRepository) private questionRepo: IKmatQuestionBankRepository,
    @inject(TYPES.KmatExamAttemptRepository) private examRepo: IKmatExamAttemptRepository,
    @inject(TYPES.KmatPracticeAttemptRepository) private practiceRepo: IKmatPracticeAttemptRepository,
    @inject(TYPES.KmatDailyReportRepository) private reportRepo: IKmatDailyReportRepository
  ) {}

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getQuestionId(question: any): string {
    return (question?._id || question?.id || "").toString();
  }

  private async getOrGenerateSectionQuestions(section: string, count: number) {
    const existing = await this.questionRepo.getRandomQuestions(section, count);
    if (existing.length >= count) return existing;

    const missing = count - existing.length;
    const prompt = buildKMATPracticePrompt(section, "Mock Exam", "Medium", missing);
    const generated = await getAIResponseJSON(prompt);
    const generatedList = Array.isArray(generated) ? generated : [];

    const created: any[] = [];
    for (const q of generatedList.slice(0, missing)) {
      if (!q?.question || !Array.isArray(q?.options) || q.options.length !== 4) {
        continue;
      }
      if (typeof q.correctAnswerIndex !== "number" || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
        continue;
      }
      const saved = await this.questionRepo.create({
        section,
        topic: "Mock Exam",
        difficulty: "Medium",
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation
      });
      created.push(saved);
    }

    const merged = [...existing, ...created].slice(0, count);
    if (merged.length < count) {
      throw new Error(`Insufficient question bank for section: ${section}`);
    }
    return merged;
  }

  async initializeUserKmat(userId: string) {
    let state = await this.stateRepo.findByUserId(userId);
    if (!state) {
      state = await this.stateRepo.create({
        userId: new mongoose.Types.ObjectId(userId) as any,
        currentDay: 1,
        startedAt: new Date(),
        isActive: true
      });
    }
    return state;
  }

  async getDailyData(userId: string) {
    const today = this.getTodayDate();
    let dailyData = await this.dailyDataRepo.findByUserAndDate(userId, today);

    if (dailyData) {
      return dailyData;
    }

    // Acquire Lock (Simplified for implementation, in production use redlock)
    const lockKey = `kmat:lock:${userId}:${today}`;
    const acquired = await redis.set(lockKey, "locked", "EX", 60, "NX");
    if (!acquired) {
      // If locked, wait or throw (CRON will retry if it remains failed)
      throw new Error("Generation in progress. Please refresh in a minute.");
    }

    try {
      const state = await this.initializeUserKmat(userId);
      const day = state.lastGeneratedDate && state.lastGeneratedDate !== today
        ? state.currentDay + 1
        : state.currentDay;

      // Generate content via AI
      const sections = ["Quantitative Ability", "Logical Reasoning", "Language Comprehension", "General Knowledge"];
      const learnContent = await Promise.all(sections.map(s => this.getAIContent(s, "General Topics")));
      const practiceSet = await this.generateDailyPractice(sections);
      
      const mockExamMeta = {
        title: `KMAT Mock Exam - Day ${day}`,
        totalQuestions: 20,
        sections: sections.map(s => ({ name: s, count: 5 }))
      };

      dailyData = await this.dailyDataRepo.create({
        userId: new mongoose.Types.ObjectId(userId) as any,
        dayNumber: day,
        date: today,
        learnContent,
        practiceSet,
        mockExamMeta,
        status: 'generated'
      });

      // Update state
      await this.stateRepo.update(state._id as string, { lastGeneratedDate: today });
      if (day !== state.currentDay) {
        await this.stateRepo.update(state._id as string, { currentDay: day });
      }

      return dailyData;
    } catch (error) {
      // Create failed record for CRON a retry
      const state = await this.stateRepo.findByUserId(userId);
      const existing = await this.dailyDataRepo.findByUserAndDate(userId, today);
      if (!existing) {
        await this.dailyDataRepo.create({
          userId: new mongoose.Types.ObjectId(userId) as any,
          dayNumber: state?.currentDay || 1,
          date: today,
          status: 'failed'
        });
      }
      throw error;
    } finally {
      await redis.del(lockKey);
    }
  }

  private async getAIContent(section: string, topic: string) {
    const prompt = buildKMATLearnPrompt(section, topic);
    const content = await getAIResponseJSON(prompt);
    if (content && typeof content === "object") {
      return content;
    }
    return {
      section,
      topic,
      concept: "Content is being refined. Please revisit this topic shortly.",
      solvedExamples: [],
      commonMistakes: [],
      examTips: []
    };
  }

  private async generateDailyPractice(sections: string[]) {
    // For brevity, using a simpler approach. In production, call AI for each or one big prompt.
    const questions: any[] = [];
    for (const section of sections) {
        const prompt = buildKMATPracticePrompt(section, "Daily Drill", "Medium", 2);
        const generated = await getAIResponseJSON(prompt);
        const generatedList = Array.isArray(generated) ? generated : [];
        // Save to question bank
        for (const q of generatedList) {
            if (!q?.question || !Array.isArray(q?.options) || q.options.length !== 4) {
              continue;
            }
            if (typeof q.correctAnswerIndex !== "number" || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
              continue;
            }
            const saved = await this.questionRepo.create({
                section,
                topic: "Daily Drill",
                difficulty: "Medium",
                question: q.question,
                options: q.options,
                correctAnswerIndex: q.correctAnswerIndex,
                explanation: q.explanation
            });
            const questionId = (saved as any)._id.toString();
            questions.push({ ...q, _id: questionId, id: questionId });
        }
    }
    if (questions.length === 0) {
      throw new Error("Unable to generate practice questions at this time.");
    }
    return questions;
  }

  async startExam(userId: string, _dayNumber?: number) {
    const today = this.getTodayDate();
    const dailyData = await this.dailyDataRepo.findByUserAndDate(userId, today);
    if (!dailyData || dailyData.status !== 'generated') {
      throw new Error("Daily content not ready.");
    }

    // Get random questions for mock
    const sections = ["Quantitative Ability", "Logical Reasoning", "Language Comprehension", "General Knowledge"];
    const examQuestions: any[] = [];
    for (const section of sections) {
        const qs = await this.getOrGenerateSectionQuestions(section, 5);
        examQuestions.push(...qs);
    }
    if (examQuestions.length < 20) {
      throw new Error("Unable to generate a complete exam right now.");
    }

    const sessionId = new mongoose.Types.ObjectId().toString();
    const answersMap: Record<string, number> = {};
    examQuestions.forEach(q => {
      answersMap[q._id.toString()] = q.correctAnswerIndex;
    });

    // Store in Redis
    const redisKey = `kmat:answers:${userId}:${sessionId}`;
    await redis.setex(redisKey, 3600, JSON.stringify(answersMap));

    const safeQuestions = examQuestions.map(q => ({
      _id: q._id,
      section: q.section,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options
    }));

    return { sessionId, dayNumber: dailyData.dayNumber, questions: safeQuestions };
  }

  async submitExam(userId: string, dayNumber: number | undefined, sessionId: string, answers: any[]) {
    const redisKey = `kmat:answers:${userId}:${sessionId}`;
    const cached = await redis.get(redisKey);
    if (!cached) throw new Error("Session expired.");

    const answersMap = JSON.parse(cached);
    let correct = 0;
    let wrong = 0;
    
    // To track sections, we need to fetch the question details
    const questionIds = Object.keys(answersMap);
    const questions = await this.questionRepo.findAll({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map(q => [(q as any)._id.toString(), q]));

    const sectionWise: Record<string, { section: string; score: number; correct: number; wrong: number; total: number }> = {};
    for (const q of questions as any[]) {
      sectionWise[q.section] ??= { section: q.section, score: 0, correct: 0, wrong: 0, total: 0 };
      sectionWise[q.section].total += 1;
    }

    for (const ans of answers) {
        const q = questionMap.get(ans.questionId);
        if (!q) continue;

        sectionWise[q.section] ??= { section: q.section, score: 0, correct: 0, wrong: 0, total: 0 };

        const correctIndex = answersMap[ans.questionId];
        const isCorrect = ans.userAnswerIndex === correctIndex;

        if (isCorrect) {
            correct++;
            sectionWise[q.section].correct++;
            sectionWise[q.section].score += 1;
        } else if (ans.userAnswerIndex !== null) {
            wrong++;
            sectionWise[q.section].wrong++;
            sectionWise[q.section].score -= 0.25;
        }
    }

    const attempted = answers.filter(a => a.userAnswerIndex !== null && a.userAnswerIndex !== undefined).length;
    let resolvedDayNumber = dayNumber;
    if (!resolvedDayNumber) {
      const dailyData = await this.dailyDataRepo.findByUserAndDate(userId, this.getTodayDate());
      resolvedDayNumber = dailyData?.dayNumber || 1;
    }

    const result = await this.examRepo.create({
        userId: new mongoose.Types.ObjectId(userId) as any,
        dayNumber: resolvedDayNumber,
        date: this.getTodayDate(),
        totalQuestions: Object.keys(answersMap).length,
        attempted,
        correct,
        wrong,
        unattempted: Object.keys(answersMap).length - attempted,
        negativeMarks: wrong * 0.25,
        finalScore: correct - (wrong * 0.25),
        sectionWiseScore: Object.values(sectionWise)
    });

    await redis.del(redisKey);
    return result;
  }

  async generateDailyReport(userId: string, dayNumber: number) {
      const exam = await this.examRepo.findOne({ userId, dayNumber });
      if (!exam) throw new Error("No exam found for this day.");

      const prompt = buildKMATAnalysisPrompt({
          totalQuestions: exam.totalQuestions,
          attempted: exam.attempted,
          correct: exam.correct,
          wrong: exam.wrong,
          unattempted: exam.unattempted,
          negativeMarks: exam.negativeMarks,
          finalScore: exam.finalScore,
          sectionWiseScore: exam.sectionWiseScore,
          wrongQuestions: [] // Fetch from practice attempts if needed
      });

      const existing = await this.reportRepo.findOne({ userId, dayNumber });
      if (existing) {
        return existing;
      }

      const analysis = await getAIResponseJSON(prompt);
      return this.reportRepo.create({
          userId: new mongoose.Types.ObjectId(userId) as any,
          dayNumber,
          date: this.getTodayDate(),
          strengths: Array.isArray(analysis?.strengths) ? analysis.strengths : [],
          weaknesses: Array.isArray(analysis?.weaknesses) ? analysis.weaknesses : [],
          negativeMarkingImpact: typeof analysis?.negativeMarkingImpact === "string" ? analysis.negativeMarkingImpact : "No significant negative marking pattern detected.",
          nextSteps: Array.isArray(analysis?.nextSteps) ? analysis.nextSteps : []
      });
  }

  async handleFailedGenerations() {
      const failed = await this.dailyDataRepo.findFailedGenerations();
      for (const data of failed) {
          try {
              // Re-run getDailyData (it will check locks and regenerate)
              await this.dailyDataRepo.delete(data._id as string); // Remove failed record
              await this.getDailyData(data.userId.toString());
          } catch (e) {
              console.error(`Retry failed for user ${data.userId}:`, e);
          }
      }
  }

  async getHistory(userId: string) {
    const dailyData = await this.dailyDataRepo.findAll({ userId });
    const exams = await this.examRepo.findAll({ userId });
    const reports = await this.reportRepo.findAll({ userId });

    return dailyData
      .sort((a, b) => b.dayNumber - a.dayNumber)
      .map(day => {
      const exam = exams.find(e => e.dayNumber === day.dayNumber);
      const report = reports.find(r => r.dayNumber === day.dayNumber);
      return {
        dayNumber: day.dayNumber,
        date: day.date,
        status: day.status,
        score: exam?.finalScore || null,
        reportAvailable: !!report
      };
    });
  }

  async submitPractice(userId: string, dayNumber: number, answers: any[]) {
    const today = this.getTodayDate();
    const dailyData = await this.dailyDataRepo.findByUserAndDate(userId, today);
    if (!dailyData || dailyData.status !== "generated") throw new Error("Daily data not found for session evaluation.");

    const results = [];
    for (const answer of answers) {
      const question = dailyData.practiceSet.find((q: any) => this.getQuestionId(q) === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswerIndex === answer.userAnswerIndex;
        const questionId = this.getQuestionId(question);
        if (!mongoose.Types.ObjectId.isValid(questionId)) continue;
        const record = await this.practiceRepo.create({
          userId: new mongoose.Types.ObjectId(userId) as any,
          dayNumber,
          questionId: new mongoose.Types.ObjectId(questionId) as any,
          isCorrect,
          attemptedAt: new Date()
        });
        results.push(record);
      }
    }
    return results;
  }

  async getResult(userId: string, id: string) {
    return await this.examRepo.findOne({ _id: id, userId });
  }
}
