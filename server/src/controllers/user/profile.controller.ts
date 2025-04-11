// src/controllers/user/profile.controller.ts
import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ProfileService } from "../../services/user/profile.service";
import { TYPES } from "../../core/types";
import { decodeToken } from "../../utils/tokenDecode";

@injectable()
export class ProfileController {
  constructor(
    @inject(TYPES.ProfileService) private profileService: ProfileService
  ) {}

  async applyMentor(req: Request, res: Response) {
    try {
      console.log("Uploaded file: ", req.file);
      if (!req.file) {
        res.status(400).json({ ok: false, msg: "No file uploaded" });
        return;
      }
      
      const { email, name, phoneNumber } = req.body;
      const decoded = decodeToken(req.cookies.token);
      
      if (!decoded) {
        res.status(401).json({ ok: false, msg: "Please login" });
        return;
      }
      
      const id = typeof decoded === "object" && "userId" in decoded 
        ? (decoded.userId as string) 
        : decoded;
      
      const mentor = await this.profileService.applyMentor(
        email, 
        name, 
        req.file,
        id,
        phoneNumber
      );

      res.status(201).json({ ok: true, msg: "Application submitted successfully", mentor });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }
}