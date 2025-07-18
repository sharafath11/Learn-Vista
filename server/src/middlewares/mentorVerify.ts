
import { Request, Response, NextFunction } from 'express';
import { clearTokens, decodeToken, verifyAccessToken } from '../utils/JWTtoken';
import { sendResponse } from '../utils/ResANDError';

export const verifyMentor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies?.token;

   if (!accessToken) {
   
       sendResponse(res,401,"",false)
        return
   }
   const decoded = verifyAccessToken(accessToken);
   
   if (decoded?.id && decoded.role === "mentor") {
     
     next();
     return
   }
 
    clearTokens(res)
  
};
