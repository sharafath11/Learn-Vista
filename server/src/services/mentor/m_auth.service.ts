import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import MentorRepo from "../../repositories/mentor/MentorRepo";

class MentorAuthService {
  async LoginMentor(email: string, password: string, res: Response): Promise<void> {
    const mentor = await MentorRepo.findOne({ email });
    if (!mentor) throw new Error("Mentor not found");

    const isPasswordValid = await bcrypt.compare(password, mentor.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { role: "mentor", mentorId: mentor._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { role: "mentor", mentorId: mentor._id },
      process.env.REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("Mtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
    });

    res.cookie("MRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ ok: true, msg: "Login successful", token, refreshToken, mentor });
  }

  async refreshAccessToken(refreshToken: string, res: Response): Promise<void> {
    if (!refreshToken) throw new Error("Refresh token is required");

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as JwtPayload;
      
      const newToken = jwt.sign(
        { role: "mentor", mentorId: decoded.mentorId },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.cookie("Mtoken", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, 
      });

      res.status(200).json({ token: newToken });
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}

export default new MentorAuthService();
