import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { IUser } from "../../types/userTypes";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { sendPasswordResetEmail } from "../../utils/emailService";
import { generateAccessToken } from "../../utils/JWTtoken";
import bcrypt from "bcrypt";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import {
  getSignedS3Url,
  updateDailyTaskWithSignedUrls,
  updateTasksWithSignedUrls,
  uploadDailyTaskAudio,
} from "../../utils/s3Utilits";
import { Types } from "mongoose";
import {
  buildDailyTaskEvaluationPrompt,
  dailyTaskPrompt,
} from "../../utils/Rportprompt";
import { getGemaniResponse } from "../../config/gemaniAi";
import { IDailyTaskRepository } from "../../core/interfaces/repositories/user/IDailyTaskRepository";
import {
  IDailyTask,
  ISubTask,
  IUpdateDailyTaskInput,
  TaskType,
} from "../../types/dailyTaskType";
import { ISubTaskWithSignedUrl } from "../../types/dailyTaskType";
import { logger } from "../../utils/logger";

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.DailyTaskRepository)
    private _dailyTaskRepo: IDailyTaskRepository
  ) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return throwError("User not found", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throwError("User was blocked", StatusCode.FORBIDDEN);
    }

    if (user.profilePicture && !user.profilePicture.startsWith("http")) {
      try {
        user.profilePicture = await getSignedS3Url(user.profilePicture);
      } catch (error) {
        user.profilePicture = null;
      }
    } else if (
      user.profilePicture === undefined ||
      user.profilePicture === null ||
      user.profilePicture === ""
    ) {
      user.profilePicture = "/default-avatar.png";
    }

    return user;
  }

  async forgetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return throwError("User not found", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      return throwError("This account was blocked", StatusCode.FORBIDDEN);
    }

    const token = generateAccessToken(user.id, "user");
    const resetLink = `${process.env.CLIENT_URL}/user/reset-password/${token}`;

    const result = await sendPasswordResetEmail(user.email, resetLink);

    if (!result.success) {
      throwError(
        "Failed to send reset email. Try again later.",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throwError("User not found", StatusCode.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(id, { password: hashedPassword });
    await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [id],
      title: "Password Reset",
      message: "Your password has been reset successfull.",
      type: "info",
    });
  }

  async getDailyTaskSevice(
    userId: string | Types.ObjectId
  ): Promise<IDailyTask> {
    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingTask = await this._dailyTaskRepo.findOne({
      userId: userObjectId,
      createdAt: { $gte: startOfDay },
    });

    if (existingTask) {
      const sendData = await updateDailyTaskWithSignedUrls(
        existingTask as IDailyTask
      );
      return sendData;
    }
    const userTasks = await this._dailyTaskRepo.findAll(userObjectId);
    const day = userTasks.length + 1;
    const prompt = dailyTaskPrompt(day);

    logger.warn(prompt);

    let tasks: ISubTask[];
    let geminiResponse: string | null = null;

    try {
      geminiResponse = await getGemaniResponse(prompt);
      let cleanResponse = geminiResponse;
      const jsonMatch = geminiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        cleanResponse = jsonMatch[1].trim();
      } else {
        const firstBrace = geminiResponse.indexOf("{");
        const lastBrace = geminiResponse.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanResponse = geminiResponse.substring(firstBrace, lastBrace + 1);
        } else {
          throw new Error(
            "Failed to extract a valid JSON structure from Gemini response."
          );
        }
      }
      const parsed = JSON.parse(cleanResponse);
      if (!parsed?.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error("Invalid Gemini response format");
      }
      tasks = parsed.tasks.map((task: any) => ({
        type: task.type,
        prompt:
          task.type === "listening"
            ? `${task.script}\n\nQuestion: ${task.question}`
            : task.description,
        isCompleted: false,
      }));
    } catch (err) {
      logger.error("Failed to create task response");
      if (geminiResponse) {
        logger.error("Raw Gemini Response:", geminiResponse);
      }
      throwError(
        "Failed to parse create task ",
        StatusCode.BAD_REQUEST
      );
    }

    const newTask = await this._dailyTaskRepo.create({
      userId: userObjectId,
      date: String(day),
      tasks,
      createdAt: new Date(),
    });

    await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [userObjectId.toString()],
      title: "New Daily Task",
      message: `Your Day ${day} task is ready!`,
      type: "info",
    });

    return newTask;
  }

  async updateDailyTask({
    taskId,
    taskType,
    answer,
    audioFile,
  }: IUpdateDailyTaskInput): Promise<ISubTask> {
    const task = await this._dailyTaskRepo.findById(taskId);
    if (!task) throwError("Task not found", StatusCode.NOT_FOUND);

    const subtaskIndex = task.tasks.findIndex((t) => t.type === taskType);
    if (subtaskIndex === -1)
      throwError("Task type not found", StatusCode.NOT_FOUND);

    const subtask = task.tasks[subtaskIndex];
    if (subtask.isCompleted) return subtask;

    let userResponseToDB: string | null = null;
    let userTextForEvaluation: string | null = null;
    let signedUrl: string | undefined;

    if (taskType === "speaking") {
      if (!audioFile)
        throwError("Audio file is required", StatusCode.BAD_REQUEST);

      const { buffer, mimetype } = audioFile;
      userResponseToDB = await uploadDailyTaskAudio(buffer, mimetype);
      userTextForEvaluation = answer || null;
      signedUrl = await getSignedS3Url(userResponseToDB);
    } else {
      userResponseToDB = answer || null;
      userTextForEvaluation = answer || null;
    }

    if (!userTextForEvaluation) {
      throwError("Answer is required for evaluation", StatusCode.BAD_REQUEST);
    }

    let aiFeedback = "No feedback available.";
    let score = 0;

    try {
      const promptForEvaluation = buildDailyTaskEvaluationPrompt({
        type: taskType as TaskType,
        prompt: subtask.prompt,
        userResponse: userTextForEvaluation,
      });

      const evaluationResponse = await getGemaniResponse(promptForEvaluation);

      const jsonMatch = evaluationResponse.match(/```json\s*([\s\S]*?)\s*```/);
      let cleanResponse = jsonMatch ? jsonMatch[1].trim() : evaluationResponse;
      const parsedEvaluation = JSON.parse(cleanResponse);

      if (parsedEvaluation.feedback) {
        aiFeedback = parsedEvaluation.feedback;
      }
      if (parsedEvaluation.score !== undefined) {
        score = parsedEvaluation.score;
      }
    } catch (err) {
      throwError(
        "Failed to get or parse AI evaluation.",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const updatedSubtask: ISubTask = {
      ...subtask,
      isCompleted: true,
      userResponse: userResponseToDB,
      aiFeedback: aiFeedback,
      score: score,
    };

    const updatedTasks = [...task.tasks];
    updatedTasks[subtaskIndex] = updatedSubtask;

    const allTasksCompleted = updatedTasks.every((t) => t.isCompleted);
    let overallScore = task.overallScore;

    if (allTasksCompleted) {
      const totalScore = updatedTasks.reduce(
        (sum, current) => sum + (current.score || 0),
        0
      );
      overallScore = Number((totalScore / updatedTasks.length).toFixed(2));
    }

    await this._dailyTaskRepo.update(taskId, {
      tasks: updatedTasks,
      overallScore: overallScore,
    });

    if (signedUrl) {
      const responseSubtask = { ...updatedSubtask, userResponse: signedUrl };
      return responseSubtask;
    }
    return updatedSubtask;
  }
  async getAllDailyTasks(userId: string): Promise<IDailyTask[]> {
    const result = await this._dailyTaskRepo.findAll({ userId });

    const sendData: IDailyTask[] = await Promise.all(
      result.map(async (dailyTaskDoc) => {
        const updatedTasks = await updateTasksWithSignedUrls(
          dailyTaskDoc.tasks as ISubTask[]
        );
        dailyTaskDoc.tasks = updatedTasks;

        return dailyTaskDoc;
      })
    );

    return sendData;
  }
}
