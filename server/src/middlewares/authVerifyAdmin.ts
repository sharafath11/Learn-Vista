import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/tokenDecode";
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
 
  if (!token) {
      res.status(401).json({ ok: false, msg: "No token provided in cookies" });
      return
  }

  try {
    const decoded = decodeToken(token) as DecodedToken;

    if (!decoded || !decoded.role) {
        res.status(403).json({ ok: false, msg: "Token is missing required role" });
        return
    }

    if (decoded.role !== "admin") {
        res.status(403).json({ ok: false, msg: "Access denied. Admins only." });
        return
    }

    req.admin = decoded; 
    next();
  } catch (error: any) {
      res.status(401).json({ ok: false, msg: "Invalid or expired token" });
      return
  }
};

export default verifyAdmin;
