import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
// import { IMentorService } from '../../core/interfaces/services/mentor/IMentorService';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { decodeToken } from '../../utils/JWTtoken';


@injectable()
export class MentorController {
  constructor(
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  async getMentor(req: Request, res: Response): Promise<void> {
    try {
      
      const decoded = decodeToken(req.cookies.mentorToken) 
      if (!decoded?.id) {
        res.status(401).json({ ok: false, msg: "Unauthorized: Invalid token" });
        return;
      }

      const mentor = await this.mentorService.getMentor(decoded.id);
      if (!mentor) {
        res.status(404).json({ ok: false, msg: "Mentor not found" });
        return;
      }

      res.status(200).json({
        ok: true,
        msg: "Mentor fetched successfully",
        mentor,
      });
    } catch (error: any) {
      console.error("Error in getMentor:", error);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }
}