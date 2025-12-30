import { Request, Response } from 'express';
import { kmatService } from '../../../services/user/kmat/kmat.service';
import { StatusCode } from '../../../enums/statusCode.enum';

export class ExamController {

  // POST /api/kmat/exam/start
  async startExam(req: Request, res: Response): Promise<void> {
    try {
      // Assuming Request is extended with user info from middleware
      // @ts-ignore
      const userId = req.user?.id || req.body.userId; 

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
        return;
      }

      const result = await kmatService.startExam(userId);
      res.status(StatusCode.CREATED).json({ success: true, data: result });
    } catch (error: any) {
      console.error("Exam Start Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to start exam" });
    }
  }

  // POST /api/kmat/exam/submit
  async submitExam(req: Request, res: Response) {
    try {
      const { sessionId, answers } = req.body;
      const result = await kmatService.submitExam(sessionId, answers);
      res.status(StatusCode.OK).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  async checkAnswer(req: Request, res: Response) {
      try {
          const { sessionId, questionId, userAnswerIndex } = req.body;
          if (!sessionId || !questionId) {
              return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Missing sessionId or questionId" });
          }
          const result = await kmatService.checkAnswer(sessionId, questionId, userAnswerIndex);
          res.status(StatusCode.OK).json({ success: true, data: result });
      } catch (error: any) {
          console.error(error);
          res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
      }
  }

  // GET /api/kmat/result/:id
  async getResult(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await kmatService.getResult(id);
      if (!result) {
        return res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Result not found" });
      }
      res.status(StatusCode.OK).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch result" });
    }
  }
}
