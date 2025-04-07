import { Request, Response } from "express";
import adminMentorService from "../../services/admin/adminMentor.service";


class AdminMentorController {
  async getAllMentors(req: Request, res: Response) {
    try {
      const mentors = await adminMentorService.getAllMentors();
      res.status(200).json({ ok: true, msg: "Mentors fetched successfully", mentors });
    } catch (error: any) {
      console.error("Error fetching mentors:", error.message);
      res.status(500).json({ ok: false, msg: "Failed to fetch mentors" });
    }
  }
  async ChangeStatusMentoeController(req: Request, res: Response) {
    try {
      await adminMentorService.changeStatusMentor(req.body.mentorId, req.body.status,req.body.email); 
      res.status(200).json({ ok: true, msg: `mentor ${req.body.status}` });
    } catch (error: any) {
      console.error("Error fetching mentors:", error.message);
      res.status(500).json({ ok: false, msg: "Failed to fetch mentors" });
    }
  }
 async adminMentorBlock(req: Request, res: Response) {
    try {
      
     const update= await adminMentorService.blockMentorServices(req.body.id, req.body.status);
      res.json({ok:true,msg: `${update.username} ${update.status ? "Blocked" : "Unblocked"} successfully`})
    } catch (error: any) {
      console.error("Error fetching mentors:", error.message);
      res.status(500).json({ ok: false, msg: "Failed to fetch mentors" });
    }
  }
  
}

export default new AdminMentorController();
