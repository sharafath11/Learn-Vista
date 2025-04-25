
import { Request, Response, NextFunction } from 'express';
import { clearTokens, decodeToken, verifyAccessToken } from '../utils/JWTtoken';

export const verifyMentor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies?.token;
   console.log(1,accessToken)
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
   if (decoded?.id && decoded.role === "mentor") {
     
     next();
     return
   }
 
    clearTokens(res)
  
};
