import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { AdminMentorService } from "../../services/admin/adminMentor.service";
import { error } from "console";

@injectable()
export class AdminMentorController {
  constructor(
    @inject(TYPES.AdminMentorService)
    private adminMentorService: AdminMentorService
  ) {}

  async getAllMentors(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const result = await this.adminMentorService.getAllMentors(
        Number(page),
        Number(limit),
        String(search)
      );
      res.status(200).json({ 
        ok: true, 
        data: result.data,
        pagination: result.pagination,
        msg: "Mentors fetched successfully" 
      });
    } catch (error: any) {
      console.error("Error fetching mentors:", error.message);
      res.status(500).json({ ok: false, msg: "Failed to fetch mentors" });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { mentorId, status, email } = req.body;
      const result = await this.adminMentorService.changeMentorStatus(
        mentorId, 
        status,
        email
      );
      res.status(200).json({ 
        ok: true, 
        data: result,
        msg: `Mentor status changed to ${status}` 
      });
    } catch (error: any) {
      console.error("Error changing mentor status:", error.message);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }

  async blockMentor(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      const result = await this.adminMentorService.toggleMentorBlock(
        id, 
        status
      );
      if (!result) {
        throw new Error("somthing fishy")
      }
      res.json({
        ok: true,
        data: result,
        msg: `${result.username} ${status ? "Blocked" : "Unblocked"} successfully`
      });
    } catch (error: any) {
      console.error("Error blocking mentor:", error.message);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }
}

export default AdminMentorController;