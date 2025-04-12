// src/middlewares/mentorVerify.ts
import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../utils/tokenDecode';

export const verifyMentor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.mentorToken;
    if (!token) {
      res.status(401).json({ ok: false, msg: 'No token provided' });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded.mentorId || decoded.role !== 'mentor') {
      res.status(401).json({ ok: false, msg: 'Unauthorized' });
      return;
    }

    // req.user = {
    //   mentorId: decoded.mentorId,
    //   role: decoded.role
    // };
    
    next();
  } catch (error: any) {
    res.status(401).json({ ok: false, msg: 'Invalid token' });
  }
};