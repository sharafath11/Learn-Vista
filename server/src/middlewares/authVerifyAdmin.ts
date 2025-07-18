import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { clearTokens, decodeToken, verifyAccessToken } from "../utils/JWTtoken";
import { sendResponse } from "../utils/ResANDError";

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
  const accessToken = req.cookies?.token;

  if (!accessToken) {
   
    sendResponse(res, 401, "", false)
    return
  }
 
 
  const decoded = verifyAccessToken(accessToken);
  
  if (decoded?.id == "admin11Sharafath" && decoded.role === "admin") {
 
    next();
    return
  }
   clearTokens(res)

};

export default verifyAdmin;
