import { Request, Response } from 'express';
import { kmatService } from '../../../services/user/kmat/kmat.service';
import { StatusCode } from '../../../enums/statusCode.enum';

export class LearnController {
  
  // POST /api/kmat/learn
  async getLearnContent(req: Request, res: Response): Promise<void> {
    try {
      const { section, topic } = req.body;
      if (!section || !topic) {
        res.status(StatusCode.BAD_REQUEST).json({ message: "Section and Topic are required" });
        return;
      }

      const content = await kmatService.getLearnContent(section, topic);
      res.status(StatusCode.OK).json({ success: true, data: content });
    } catch (error: any) {
      console.error("Learn Controller Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to generate content" });
    }
  }

  // POST /api/kmat/practice
  async generatePracticeQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { section, topic, difficulty } = req.body;
      if (!section || !topic || !difficulty) {
        res.status(StatusCode.BAD_REQUEST).json({ message: "Section, Topic, and Difficulty are required" });
        return;
      }

      const questions = await kmatService.generatePracticeQuestions(section, topic, difficulty);
      res.status(StatusCode.OK).json({ success: true, data: questions });
    } catch (error: any) {
      console.error("Practice Controller Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to generate questions" });
    }
  }
}
