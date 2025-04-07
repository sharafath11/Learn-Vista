import { Request, Response } from "express";
import mentorService from "../../services/mentor/mentor.service";
import { decodeToken } from "../../utils/tokenDecode";

interface MentorTokenPayload {
  mentorId: string;
}

class MentorController {
  async getMentor(req: Request, res: Response) {
    try {
      const decoded = decodeToken(req.cookies.mentorToken) as MentorTokenPayload;
      if (!decoded?.mentorId) {
          res.status(401).json({ ok:false ,msg: "Unauthorized: Invalid token" });
          return
      }
      const mentor = await mentorService.getUser(decoded.mentorId);
      if (!mentor) {
          res.status(404).json({ok:false, msg: "Mentor not found" });
          return
      }
       res.status(200).json({
        ok: true,
        msg: "Mentor fetched successfully",
        mentor,
      });
    } catch (error:any) {
      console.error("Error in getMentor:", error);
        res.status(500).json({ ok: false, msg: error.message });
        return
    }
  }
}

export default new MentorController();
