import { Request, Response } from "express";
import profileService from "../../services/user/profile.service";
import { decodeToken } from "../../utils/tokenDecode";

class ProfileController {
  async applyMentor(req: Request, res: Response) {
    try {
      console.log("Uploaded file: ", req.file);
      if (!req.file) {
        res.status(400).json({ ok:false,msg: "No file uploaded" });
        return
      }

      const { email, name } = req.body;
      const decoded = decodeToken(req.cookies.token);
      if (!decoded) {
        res.status(401).json({ ok: false, msg: "please login" });
        return
      }
      const id = typeof decoded === "object" && "userId" in decoded ? (decoded.userId as string) : decoded;
      const mentor = await profileService.applyMentor(email, name, req.file,id);

      res.status(201).json({ok:true ,msg: "Application submitted successfully", mentor });
    } catch (error: any) {
      console.error(error)
      res.status(500).json({ok:false,msg: error.message });
    }
  }
}

export default new ProfileController();
