
import { Request, Response, NextFunction } from 'express';
import { clearTokens, decodeToken, verifyAccessToken } from '../utils/JWTtoken';
import { sendResponse } from '../utils/ResANDError';

export const verifyMentor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies?.token;
   console.log(1,accessToken)
   if (!accessToken) {
     console.log(2)
       sendResponse(res,401,"",false)
        return
   }
   const decoded = verifyAccessToken(accessToken);
   console.log(decoded)
   if (decoded?.id && decoded.role === "mentor") {
     
     next();
     return
   }
 
    clearTokens(res)
  
};
