import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Role = "admin" | "user" | "mentor";

interface DecodedToken {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      admin?: DecodedToken;
    }
  }
}

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.adminToken;
  const refreshToken = req.cookies?.adminRefreshToken;
  const ADMIN_SECRET = process.env.JWT_SECRET || "your_admin_secret";
  const ADMIN_REFRESH_SECRET = process.env.REFRESH_SECRET || "your_admin_refresh_secret";

  if (token) {
    try {
      const decoded = jwt.verify(token, ADMIN_SECRET) as DecodedToken;
      if (decoded && decoded.role === "admin") {
        req.admin = decoded;
        next();
        return
      }
    } catch (err) {
      console.log("Access token error");
    }
  }

  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, ADMIN_REFRESH_SECRET) as DecodedToken;
      if (decodedRefresh && decodedRefresh.role === "admin") {
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id, role: decodedRefresh.role },
          ADMIN_SECRET,
          { expiresIn: "15m" }
        );

        res.cookie("adminToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000
        });

        req.admin = decodedRefresh;
        next();
        return
      } else {
        res.status(403).json({ ok: false, msg: "Invalid role" });
        return
      }
    } catch (err: any) {
      console.log("Refresh token error:", err.message);
      res.status(401).json({ ok: false, msg: "Refresh token invalid or expired" });
      return
    }
  }

  res.status(401).json({ ok: false, msg: "Authentication required" });
  return
};

export default verifyAdmin;
