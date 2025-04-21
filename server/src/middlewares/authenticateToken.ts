import { Request, Response, NextFunction } from "express";
import {  clearTokens, verifyAccessToken } from "../utils/JWTtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  if (!accessToken) {
     res
      .status(401)
       .json({ ok: false, msg: "Authentication required", role: "user" });
       return
  }

  const decoded = verifyAccessToken(accessToken);
  
  if (decoded?.id&&decoded.role==="user") {
    next();
    return
  }
   clearTokens(res)
};
