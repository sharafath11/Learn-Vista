import { inject, injectable } from "inversify";
import { IMentorLessonsController } from "../../core/interfaces/controllers/mentor/IMentorLesson.Controller";
import { TYPES } from "../../core/types";
import { Request, Response } from "express";
import { IMentorLessonService } from "../../core/interfaces/services/mentor/IMentorLesson.Service";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { ILesson, ILessonUpdateData } from "../../types/lessons";
import { decodeToken } from "../../utils/JWTtoken";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/AWS";
import { GetObjectCommand } from "@aws-sdk/client-s3";
dotenv.config();


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID
const CLOUDFRONT_DOMAIN=process.env.CLOUDFRONT_DOMAIN
console.log('[INIT] Using AWS S3 Configuration:');
console.log('[INIT] AWS Region:', AWS_REGION);
console.log('[INIT] S3 Bucket Name:', S3_BUCKET_NAME);
console.log('[INIT] AWS Access Key ID:', AWS_ACCESS_KEY_ID ? '[REDACTED]' : 'Missing');
console.log('[INIT] AWS Secret Access Key:', AWS_SECRET_ACCESS_KEY ? '[REDACTED]' : 'Missing');

@injectable()
export class MentorLessonsController implements IMentorLessonsController {
    constructor(
        @inject(TYPES.MentorLessonsService) private _mentorLessonsSerive: IMentorLessonService
    ) { }

    async getLessons(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const result = await this._mentorLessonsSerive.getLessons(courseId);
            sendResponse(res, StatusCode.OK, "", true, result);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

      async S3Upload(req: Request, res: Response): Promise<void> {
        const { fileName, fileType } = req.body;
      

        // if (!fileName || !fileType) {
        //     return handleControllerError(res, throwError("File name and fileType are required in the request body.", StatusCode.BAD_REQUEST));
        // }

        if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
            
            return handleControllerError(res, throwError("Server configuration error: AWS S3 credentials or bucket name missing.", StatusCode.INTERNAL_SERVER_ERROR));
        }
        AWS.config.update({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION
        });

        const s3 = new AWS.S3();
        const s3Key = `videos/${Date.now()}-${fileName}`;

        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: s3Key,
            Expires: 60 * 5, 
            ContentType: fileType,
           
        };

        s3.getSignedUrl('putObject', params, (err, uploadURL) => {
            if (err) {
                console.error('[S3Upload] Error generating S3 pre-signed URL:', err);
                return handleControllerError(res, throwError("Failed to generate S3 pre-signed URL.", StatusCode.INTERNAL_SERVER_ERROR));
            }
            const publicVideoUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
            sendResponse(res, StatusCode.OK, "", true, { signedUploadUrl: uploadURL, publicVideoUrl: publicVideoUrl });
        });
    }
   async addLesson(req: Request, res: Response): Promise<void> {
        try {
           
            const {
                courseId,
                title,
                description,
                order,
                videoUrl,
                duration,
             
            } = req.body;

            
            const thumbnailFile = req.file; 

            if (!title || !videoUrl || !courseId) {
                return handleControllerError(res, throwError("Title, video URL, and course ID are required", StatusCode.BAD_REQUEST));
            }
            const lessonData: Partial<ILesson> = {
                courseId: courseId,
                title: title,
                description: description,
                order: parseInt(order as string),
                videoUrl: videoUrl,
                duration: duration,
                
                thumbnail: thumbnailFile ? thumbnailFile.buffer : undefined, 
               
            };

            const createdLesson = await this._mentorLessonsSerive.addLesson(lessonData);

            sendResponse(res, StatusCode.CREATED, "Lesson added successfully", true, createdLesson);

        } catch (error: any) {
            console.error("Error adding lesson:", error);
            handleControllerError(res, error);
        }
    }

     async editLesson(req: Request, res: Response): Promise<void> {
  try {
    const lessonId = req.params.lessonId;
    const {
      title,
      description,
      order,
      videoUrl,
      duration,
      clearThumbnail,
    } = req.body;

    const newThumbnailFile = req.file;

    if (!lessonId) {
      return handleControllerError(
        res,
        throwError("Lesson ID is required for update", StatusCode.BAD_REQUEST)
      );
    }

    const updateData: ILessonUpdateData = {
      title,
      description,
      order: order ? parseInt(order as string) : undefined,
      videoUrl,
      duration,
      thumbnailFileBuffer: newThumbnailFile ? newThumbnailFile.buffer : undefined,
      clearThumbnail: clearThumbnail === "true",
    };

    const updatedLesson = await this._mentorLessonsSerive.editLesson(lessonId, updateData);
    sendResponse(res, StatusCode.OK, "Lesson updated successfully", true, updatedLesson);
  } catch (error) {
    console.error("Error editing lesson:", error);
    handleControllerError(res, error);
  }
}


async deleteS3File(req: Request, res: Response): Promise<void> {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            return handleControllerError(res, throwError("fileUrl is required", StatusCode.BAD_REQUEST));
        }

        const s3 = new AWS.S3();
        const bucket = S3_BUCKET_NAME!;
        const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

        await s3.deleteObject({ Bucket: bucket, Key: key }).promise();

        sendResponse(res, StatusCode.OK, "File deleted successfully", true, null);
    } catch (error) {
        handleControllerError(res, error);
    }
}
     async getSignedVideoUrl(req: Request, res: Response): Promise<void> {
        if (req.method !== 'POST') {
            return sendResponse(res, StatusCode.METHOD_NOT_ALLOWED, 'Method Not Allowed. Use POST.', false);
        }
        const { lessonId, videoUrl } = req.body;
        if (!lessonId) {
            return sendResponse(res, StatusCode.BAD_REQUEST, 'Lesson ID is required in the request body.', false);
        }
        try {
            const token = req.cookies.token;
            if (!token) {
                throwError("Authentication required: No token found.", StatusCode.UNAUTHORIZED);
            }

            const mentor = decodeToken(token);
            if (!mentor || !mentor.id) {
                throwError("Authentication failed: Invalid or missing user ID in token.", StatusCode.UNAUTHORIZED);
            }

            if (mentor.role !== "mentor") {
                throwError("Access denied: Only mentors can view this content.", StatusCode.FORBIDDEN);
            }
            let s3Key = videoUrl; 
            const bucketDomain = `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
            const pathStyleDomain = `s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`;

            if (videoUrl.startsWith(`https://${bucketDomain}/`)) {
                s3Key = videoUrl.substring(`https://${bucketDomain}/`.length);
            } else if (videoUrl.startsWith(`https://${pathStyleDomain}/`)) {
                s3Key = videoUrl.substring(`https://${pathStyleDomain}/`.length);
            } else {
                console.warn("Video URL not in expected S3 URL format. Assuming it's already an S3 Key:", videoUrl);
            }
            if (!s3Key) {
                throwError("Invalid video URL format provided. Could not extract S3 key.", StatusCode.BAD_REQUEST);
            }
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME!, 
                Key: s3Key,
            });

            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return sendResponse(res, StatusCode.OK, 'Signed video URL generated successfully.', true, { signedUrl });

        } catch (error: any) {
            if (error.statusCode && error.message) {
                return sendResponse(res, error.statusCode, error.message, false);
            }
            console.error("An unexpected error occurred in getSignedVideoUrl:", error);
            return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, 'An unexpected server error occurred.', false);
        }
     }
    async getQuestions(req: Request, res: Response): Promise<void> {
        try {
            const lessonId=req.params.lessonId
            if(!lessonId) throwError("Somthing wrent wrong")
            const result = await this._mentorLessonsSerive.getQuestionService(lessonId);
            sendResponse(res,StatusCode.OK,"",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async addQuestions(req: Request, res: Response): Promise<void> {
        try {
            console.log("body show",req.body)
            
            const result = await this._mentorLessonsSerive.addQuestionService(req.body.lessonId,req.body);
            if (!result) throwError("Somthing wront wrong");
            sendResponse(res,StatusCode.OK,"Question added succesfully",true,result)
        } catch (error) {
              handleControllerError(res,error)
        }
    }
    async editQuestions(req: Request, res: Response): Promise<void> {
        try {
            const questionId = Number(req.params.questionId);
            const result = await this._mentorLessonsSerive.editQuestionService(questionId, req.body);
            sendResponse(res,StatusCode.OK,"Question Edited Succesfully",true)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    
}