import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
// import { IMentorService } from '../../core/interfaces/services/mentor/IMentorService';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { decodeToken, verifyAccessToken } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse } from '../../utils/ResANDError';


@injectable()
export class MentorController {
  constructor(
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  async getMentor(req: Request, res: Response): Promise<void> {
    try {
      
      const decoded = decodeToken(req.cookies.token);
      console.log(1);
      console.log(decoded);
      
      console.log(2);
      
      
      if (!decoded?.id) {
        
        return sendResponse(res,401,"Unauthorized",false)
        
      }

      const mentor = await this.mentorService.getMentor(decoded.id);
      if (!mentor) {
     
        return sendResponse(res,404,"mentor not found",false)
      }
      return sendResponse(res,200,"Mentor fetced succes fully",true,mentor)
    } catch (error) {
     
      handleControllerError(res,error,500)
    }
  }
  
}