import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies?.token;
  const refreshToken = req.cookies?.refreshToken;


  if (!accessToken) {
    res.status(401).json({ ok: false, msg: "Unauthorized - No access token" });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as any;
    if(decoded.role!=="user")
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        res.status(401).json({ ok: false, msg: "Access token expired - No refresh token available" });
        return;
      }

      try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
        const newAccessToken = jwt.sign(
          { userId: refreshDecoded.userId },
          process.env.JWT_SECRET as string,
          { expiresIn: "15m" }
        );

        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        req.user = refreshDecoded;
        next();
      } catch (refreshError) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.status(403).json({ ok: false, msg: "Invalid refresh token" });
      }
      return;
    }

    res.status(403).json({ ok: false, msg: "Invalid token" });
  }
};