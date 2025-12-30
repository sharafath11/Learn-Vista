
import { KMATQuestion } from "../../../models/user/kmat/question.model";
import { KMATExamSession } from "../../../models/user/kmat/examSession.model";
import { KMATResult } from "../../../models/user/kmat/result.model";
import {
  buildKMATLearnPrompt,
  buildKMATPracticePrompt,
  buildKMATExamPrompt,
  buildKMATAnalysisPrompt
} from "../../../utils/rportprompt";
import { getAIResponseJSON } from "../../../config/gemaniAi";
import { redis } from "../../../config/redis";

export class KMATService {

  async getLearnContent(section: string, topic: string) {
    const prompt = buildKMATLearnPrompt(section, topic);
    return getAIResponseJSON(prompt);
  }

  async generatePracticeQuestions(
    section: string,
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard",
    count: number = 5,
    previousMistakes: string[] = []
  ) {
    const prompt = buildKMATPracticePrompt(
      section,
      topic,
      difficulty,
      count,
      previousMistakes
    );

    const questionsData = await getAIResponseJSON(prompt);

    const savedQuestions = await Promise.all(
      questionsData.map((q: any) =>
        new KMATQuestion({
          section,
          topic,
          difficulty,
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation
        }).save()
      )
    );

    return savedQuestions;
  }

  async startExam(userId: string) {
    const sections = [
      "Quantitative Ability",
      "Logical Reasoning",
      "Language Comprehension",
      "General Knowledge"
    ];

    let examQuestions: any[] = [];

    for (const section of sections) {
      let questions = await KMATQuestion.aggregate([
        { $match: { section } },
        { $sample: { size: 5 } }
      ]);

      if (questions.length < 5) {
        const seedPrompt = buildKMATExamPrompt(section, "Medium", 5);
        const generated = await getAIResponseJSON(seedPrompt);

        await Promise.all(
          generated.map((q: any) =>
            new KMATQuestion({
              section,
              topic: "General",
              difficulty: "Medium",
              question: q.question,
              options: q.options,
              correctAnswerIndex: q.correctAnswerIndex
            }).save()
          )
        );

        questions = await KMATQuestion.aggregate([
          { $match: { section } },
          { $sample: { size: 5 } }
        ]);
      }

      examQuestions.push(...questions);
    }

    const session = new KMATExamSession({
      userId,
      questions: examQuestions.map(q => q._id),
      status: "in_progress"
    });

    await session.save();

    // ---------------------------------------------
    // REDIS ANSWER SECURITY
    // ---------------------------------------------
    const answersMap: Record<string, number> = {};
    examQuestions.forEach(q => {
      answersMap[q._id.toString()] = q.correctAnswerIndex;
    });

    // Store in Redis with 4 hour TTL
    const redisKey = `kmat:exam:${session._id}:answers`;
    await redis.setex(redisKey, 4 * 60 * 60, JSON.stringify(answersMap));

    const safeQuestions = examQuestions.map(q => ({
      _id: q._id,
      section: q.section,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options
      // correctAnswerIndex is OMITTED
    }));

    return { sessionId: session._id, questions: safeQuestions };
  }

  async checkAnswer(sessionId: string, questionId: string, userAnswerIndex: number | null) {
      if (userAnswerIndex === null) {
          return { isCorrect: false, marksAwarded: 0 };
      }

      const redisKey = `kmat:exam:${sessionId}:answers`;
      const answersData = await redis.get(redisKey);

      if (!answersData) {
          throw new Error("Exam session expired or invalid.");
      }

      const answersMap = JSON.parse(answersData);
      const correctIndex = answersMap[questionId];

      if (correctIndex === undefined) {
          throw new Error("Invalid question ID for this session.");
      }

      const isCorrect = userAnswerIndex === correctIndex;
      return {
          isCorrect,
          marksAwarded: isCorrect ? 1 : -0.25
      };
  }

  async submitExam(
    sessionId: string,
    userAnswers: { questionId: string; userAnswerIndex: number | null }[]
  ) {
    const session = await KMATExamSession.findById(sessionId).populate("questions");
    if (!session || session.status === "submitted") {
      throw new Error("Invalid session");
    }

    // ---------------------------------------------
    // FETCH CACHED ANSWERS FROM REDIS
    // ---------------------------------------------
    const redisKey = `kmat:exam:${sessionId}:answers`;
    const cachedAnswers = await redis.get(redisKey);

    if (!cachedAnswers) {
        throw new Error("Exam session expired or data missing. Cannot grade.");
    }
    const answersMap = JSON.parse(cachedAnswers);

    let correct = 0;
    let wrong = 0;
    let totalScore = 0;

    const sectionScores: Record<string, { score: number; correct: number; wrong: number }> = {};
    const answerDetails: any[] = [];
    
    // Map full question details for reference (e.g. section/topic)
    const dbQuestionsMap = new Map<string, any>();
    (session.questions as any[]).forEach(q => {
      dbQuestionsMap.set(q._id.toString(), q);
      sectionScores[q.section] ??= { score: 0, correct: 0, wrong: 0 };
    });

    for (const ans of userAnswers) {
      const q = dbQuestionsMap.get(ans.questionId);
      if (!q) continue;

      const correctAnswerIndex = answersMap[ans.questionId]; // SOURCE OF TRUTH

      if (correctAnswerIndex === undefined) continue;

      let marks = 0;
      let isCorrect = false;

      if (ans.userAnswerIndex === correctAnswerIndex) {
        correct++;
        marks = 1;
        isCorrect = true;
        sectionScores[q.section].correct++;
        sectionScores[q.section].score += 1;
      } else if (ans.userAnswerIndex !== null) {
        wrong++;
        marks = -0.25; // Negative marking
        sectionScores[q.section].wrong++;
        sectionScores[q.section].score -= 0.25;
      }

      totalScore += marks;

      answerDetails.push({
        questionId: q._id,
        userAnswerIndex: ans.userAnswerIndex,
        isCorrect,
        marksAwarded: marks
      });
    }

    const totalQuestions = session.questions.length;
    const attempted = correct + wrong;
    const unattempted = totalQuestions - attempted;

    session.status = "submitted";
    session.submittedAt = new Date();
    await session.save();
    
    // Cleanup Redis (Optional, keep for review if needed, but per req we can delete or expire)
    // await redis.del(redisKey); 

    const result = new KMATResult({
      examSessionId: sessionId,
      userId: session.userId,
      totalQuestions,
      attempted,
      correct,
      wrong,
      unattempted,
      negativeMarks: wrong * 0.25,
      finalScore: totalScore,
      sectionWiseScore: Object.entries(sectionScores).map(
        ([section, data]) => ({ section, ...data })
      ),
      answers: answerDetails
    });

    await result.save();

    const analysisPrompt = buildKMATAnalysisPrompt({
      totalQuestions,
      attempted,
      correct,
      wrong,
      unattempted,
      negativeMarks: wrong * 0.25,
      finalScore: totalScore,
      sectionWiseScore: result.sectionWiseScore,
      wrongQuestions: answerDetails
        .filter(a => !a.isCorrect)
        .map(a => ({
          section: dbQuestionsMap.get(a.questionId.toString())?.section,
          topic: dbQuestionsMap.get(a.questionId.toString())?.topic
        }))
    });

    result.weaknessAnalysis = await getAIResponseJSON(analysisPrompt);
    await result.save();

    return result;
  }

  async getResult(sessionId: string) {
    return KMATResult.findOne({ examSessionId: sessionId }).populate({
      path: "answers.questionId",
      model: "KMATQuestion"
    });
  }
}

export const kmatService = new KMATService();
