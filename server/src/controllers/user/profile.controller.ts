import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ProfileService } from "../../services/user/profile.service";
import { TYPES } from "../../core/types";
import { decodeToken } from "../../utils/tokenDecode";
import { validateMentorApplyInput } from "../../utils/userValidation";

@injectable()
export class ProfileController {
  constructor(
    @inject(TYPES.ProfileService) private profileService: ProfileService
  ) {}

  async applyMentor(req: Request, res: Response) {
    try {
      const { email, username, phoneNumber, expertise } = req.body;
      const { isValid, errorMessage } = validateMentorApplyInput(
        email, username, phoneNumber, req.file || null, expertise
      );

      if (!isValid) throw new Error(errorMessage);
      if (!req.file) {
        res.status(400).json({ ok: false, msg: "No file uploaded" });
        return
      }

      const decoded = decodeToken(req.cookies.token);
      if (!decoded) {
        res.status(401).json({ ok: false, msg: "Please login" });
        return
      }
      const id = typeof decoded === "object" && "userId" in decoded ? decoded.userId : decoded;
      const mentor = await this.profileService.applyMentor(
        email, username, req.file, expertise, id, phoneNumber
      );

      res.status(201).json({ ok: true, msg: "Application submitted successfully", mentor });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }
}
