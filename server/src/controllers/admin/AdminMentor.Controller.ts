import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
import { IAdminMentorServices } from "../../core/interfaces/services/admin/IAdminMentorServices";

@injectable()
export class AdminMentorController implements IAdminMentorController{
  constructor(
    @inject(TYPES.AdminMentorService)
    private adminMentorService: IAdminMentorServices
  ) {}

  async getAllMentors(req: Request, res: Response) {
    try {
      
      const result = await this.adminMentorService.getAllMentors();
  
      res.status(200).json({ 
        ok: true, 
        mentors: result,
        
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
      await this.adminMentorService.changeMentorStatus(
        mentorId, 
        status,
        email
      );
      res.status(200).json({ 
        ok: true, 
       
        msg: `Mentor status changed to ${status}` 
      });
    } catch (error: any) {
      console.error("Error changing mentor status:", error.message);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }

  async blockMentor(req: Request, res: Response) {
    try {
      const { mentorId, isBlock } = req.body;
      const result = await this.adminMentorService.toggleMentorBlock(
        mentorId, 
        isBlock
      );
      console.log("req.body",req.body,"res",result)
      if (!result) {
        throw new Error("somthing fishy")
      }
      res.json({
        ok: true,
        data: result,
        msg: `${result.username} ${isBlock ? "Blocked" : "Unblocked"} successfully`
      });
    } catch (error: any) {
      console.error("Error blocking mentor:", error.message);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }
  mentorDetils(req:Request,res:Response) {
    try {
      const id=req.params.id
      const mentor = this.adminMentorService.mentorDetils(id)
      if (!mentor) throw new Error("Error fetching mentors")
      res.status(200).json({ok:true,msg:"Mentor fetching succes fully",mentor})
    } catch (error:any) {
      res.status(500).json({ok:false,msg:error.message})
    }
  }
 
}

export default AdminMentorController;