import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/userTypes";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/JWTtoken"; 

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

  // Access Token Verification
  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    if (decoded) {
      (req as AuthenticatedRequest).user = {
        id: decoded.id,
        role: decoded.role,
      };
      next();
      return
    }
    // fallback to refresh token if access token invalid or expired
  }

  // Refresh Token Flow
  if (refreshToken) {
    const refreshDecoded = verifyRefreshToken(refreshToken);
    if (!refreshDecoded) {
      res.clearCookie("token");
      res.clearCookie("refreshToken");
       res
        .status(403)
         .json({ ok: false, msg: "Session expired. Please login again." });
         return
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(refreshDecoded.id, refreshDecoded.role);
    const newRefreshToken = generateRefreshToken(refreshDecoded.id, refreshDecoded.role);

    // Set cookies
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    (req as AuthenticatedRequest).user = {
      id: refreshDecoded.id,
      role: refreshDecoded.role,
    };

    next();
    return
  }

  res.status(403).json({ ok: false, msg: "Invalid authentication" });
  return
};
