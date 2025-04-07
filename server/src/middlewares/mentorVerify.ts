import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/tokenDecode";

type Role = "mentor";

interface DecodedToken {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      mentor?: DecodedToken; 
    }
  }
}

const verifyMentor = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.mentorToken;
  if (!token) {
    res.status(401).json({ ok: false, msg: "No token provided in cookies" });
    return
  }

  try {
    const decoded = decodeToken(token) as DecodedToken;

    if (!decoded?.role || decoded.role !== "mentor") {
      console.log("cece",decoded)
      res.status(403).json({ ok: false, msg: "Access denied. Mentors only." });
      return
    }

    req.mentor = decoded; 
    next();
  } catch (error: any) {
    res.status(401).json({ ok: false, msg: "Invalid or expired token" });
    return
  }
};

export default verifyMentor;
