// src/middlewares/authenticateToken.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/userTypes";

import { RequestHandler } from "express";


export function authenticated(
  handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void
): RequestHandler {
  return (req, res, next) => {
    handler(req as AuthenticatedRequest, res, next);
  };
}
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {


  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({ ok: false, msg: "No token provided" });
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role?: string;
      mentorId?: string;
    };

    req.user = {
      id: decoded.userId,
      role: decoded.role,
      mentorId: decoded.mentorId
    };
    // console.log("hyyyy")
    next();
  } catch (error) {
    res.status(403).json({ ok: false, msg: "Invalid token" });
    return
  }
};