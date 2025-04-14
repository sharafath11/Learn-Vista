import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/userTypes";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken && !refreshToken) {
    res.status(401).json({ ok: false, msg: "Authentication required" });
    return
  }

  // Verify access token first
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as {
        userId: string;  // Changed to userId for consistency
        role?: string;
      };

      if (!decoded.userId) {
        throw new Error("Missing userId in token");
      }

      (req as AuthenticatedRequest).user = {
        id: decoded.userId,  // Map userId to id
        role: decoded.role,
      };
      
      next();
      return
    } catch (error) {
      if (!refreshToken) {
        res.status(401).json({ ok: false, msg: "Access token expired" });
        return
      }
      // Continue to refresh token flow
    }
  }

  // Refresh token flow
  if (refreshToken) {
    try {
      const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as {
        userId?: string;  // Make optional to check existence
        id?: string;      // Legacy field name
        role?: string;
      };

      // Determine the user ID - check both possible field names
      const userId = refreshDecoded.userId || refreshDecoded.id;
      if (!userId) {
        throw new Error("Missing user ID in refresh token");
      }

      // Generate new tokens with consistent field names
      const newAccessToken = jwt.sign(
        { userId, role: refreshDecoded.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId, role: refreshDecoded.role },
        process.env.REFRESH_SECRET as string,
        { expiresIn: '7d' }
      );

      // Set cookies
      res.cookie('token', newAccessToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
      
      res.cookie('refreshToken', newRefreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      (req as AuthenticatedRequest).user = {
        id: userId,
        role: refreshDecoded.role,
      };

      next();
      return
    } catch (error) {
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.status(403).json({ ok: false, msg: "Session expired. Please login again." });
      return
    }
  }

  res.status(403).json({ ok: false, msg: "Invalid authentication" });
  return
};