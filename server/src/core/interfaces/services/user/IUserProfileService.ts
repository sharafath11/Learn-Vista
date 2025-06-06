import { JwtPayload } from "jsonwebtoken";
import { IMentor, ISocialLink } from "../../../../types/mentorTypes";

  
  

  export interface IProfileService {
     applyMentor(
      email: string, 
      username: string, 
      file: Express.Multer.File, 
      expertise: string[],
      userId: string | JwtPayload, 
      phoneNumber: string,
      socialLinks: ISocialLink[]  
    ) : Promise<{
      success: boolean;
      application: IMentor;
      cvUrl: string;
    }>;
    editProfileService(username: string, imageBuffer: Buffer | undefined, id: string): Promise<{ username: string, image: string }>
    changePassword(userId:string,passowrd:string,newPassword:string):Promise<void>
  }