import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import UserProfileRepo from "../../repositories/user/UserProfileRepo";
import { IMentor } from "../../types/mentorTypes";
import { Types } from "mongoose";

class ProfileService {
  async applyMentor(
    email: string,
    username: string,
    file: Express.Multer.File,
    userId: string | JwtPayload
  ) {
    try {
     
      if (!file) throw new Error("No file uploaded");
      if (!email?.trim() || !username?.trim()) {
        throw new Error("Email and username are required");
      }
      if (!userId) throw new Error("Please login");
      
      
      if (file.mimetype !== 'application/pdf') {
        throw new Error("Only PDF files are accepted");
      }
     
      const MAX_FILE_SIZE = 5 * 1024 * 1024; 
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File must be smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      }

      
    
      
      const uploadResult = await new Promise<{
        secure_url: string;
        public_id: string;
        bytes: number;
      }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "LearnVista/mentors/resumes",
            format: 'pdf',
            public_id: `mentor-cv-${Date.now()}-${username.replace(/\s+/g, '-')}`,
            tags: ['mentor_application', email],
            context: `user_id=${userId}|username=${username}`
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', {
                message: error.message,
                http_code: error.http_code,
                name: error.name
              });
              reject(new Error(`File upload failed: ${error.message}`));
            } else if (!result) {
              reject(new Error("Cloudinary returned no result"));
            } else {
              console.log('Upload successful:', {
                public_id: result.public_id,
                format: result.format,
                bytes: result.bytes
              });
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });

      const mentorData: Partial<IMentor> = {
        email: email.trim(),
        username: username.trim(),
        isVerified: false,
        cvOrResume: uploadResult.secure_url,
        cvPublicId: uploadResult.public_id,
        cvSize: uploadResult.bytes,
        applicationDate: new Date(),
        userId: new Types.ObjectId(userId as string),
        status: 'pending',
        expertise: [],
        socialLinks: []
      };

      const application = await UserProfileRepo.applyMentorRepo(mentorData);
      
      return {
        success: true,
        application,
        cvUrl: uploadResult.secure_url
      };

    } catch (error: any) {
      console.error('Mentor application error:', {
        email,
        username,
        error: error.message,
        stack: error.stack
      });
      let errorMessage = error.message;
      if (error.message.includes('File size limit exceeded')) {
        errorMessage = 'File must be smaller than 10MB';
      } else if (error.message.includes('Cloudinary')) {
        errorMessage = 'File upload service unavailable. Please try again later.';
      } else if (error.message.includes('duplicate key')) {
        errorMessage = 'You have already submitted a mentor application';
      }

      throw new Error(errorMessage);
    }
  }
}

export default new ProfileService();