import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { clearTokens, decodeToken, verifyAccessToken } from "../utils/JWTtoken";

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
  console.log(1)
  if (!accessToken) {
    console.log(2)
     res
      .status(401)
       .json({ ok: false, msg: "" });
       return
  }
  console.log(3)
 
  const decoded = verifyAccessToken(accessToken);
  console.log(decoded)
  if (decoded?.id == "admin11Sharafath" && decoded.role === "admin") {
    console.log(4)
    next();
    return
  }
  console.log(5)
   clearTokens(res)

};

export default verifyAdmin;
