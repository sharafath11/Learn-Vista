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
import { STATUS_CODES } from "http";
dotenv.config();


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID
const CLOUDFRONT_DOMAIN=process.env.CLOUDFRONT_DOMAIN


@injectable()
export class MentorLessonsController implements IMentorLessonsController {
    constructor(
        @inject(TYPES.MentorLessonsService) private _mentorLessonsSerive: IMentorLessonService
    ) { }

    async getLessons(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const decoded=decodeToken(req.cookies.token)
            const result = await this._mentorLessonsSerive.getLessons(courseId,decoded?.id as string);
            sendResponse(res, StatusCode.OK, "", true, result);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

   
 async S3Upload(req: Request, res: Response): Promise<void> {
    const { fileName, fileType } = req.body;

    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME || !AWS_REGION) {
      return handleControllerError(
        res,
        throwError("Server configuration error: AWS credentials or bucket name missing.", StatusCode.INTERNAL_SERVER_ERROR)
      );
    }

    // Initialize AWS SDK v2 config and S3 instance
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });

    const s3 = new AWS.S3();
    const s3Key = `videos/${Date.now()}-${fileName}`;

    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Expires: 60 * 5, // 5 minutes
      ContentType: fileType,
    };

    // Generate PUT URL for upload
    s3.getSignedUrl("putObject", uploadParams, (err, signedUploadUrl) => {
      if (err) {
        return handleControllerError(res, throwError("Upload URL generation failed.", StatusCode.INTERNAL_SERVER_ERROR));
      }

      const publicVideoUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;

      // Generate GET URL for viewing
      const viewParams = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Expires: 3600, // 1 hour
      };

      const signedViewUrl = s3.getSignedUrl("getObject", viewParams);

      return sendResponse(res, StatusCode.OK, "Signed URLs generated", true, {
        signedUploadUrl,
        publicVideoUrl,
        signedViewUrl,
      });
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
            return sendResponse(res, StatusCode.METHOD_NOT_ALLOWED, 'Method Not Allowed.', false);
        }
         const lessonId=req.params.lessonId
        const { videoUrl } = req.body;
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
          
            
            const result = await this._mentorLessonsSerive.addQuestionService(req.body.lessonId,req.body);
            if (!result) throwError("Somthing wront wrong");
            sendResponse(res,StatusCode.OK,"Question added succesfully",true,result)
        } catch (error) {
              handleControllerError(res,error)
        }
    }
    async editQuestions(req: Request, res: Response): Promise<void> {
        try {
            const questionId = req.params.questionId;

            await this._mentorLessonsSerive.editQuestionService(questionId, req.body);
            sendResponse(res,StatusCode.OK,"Question Edited Succesfully",true)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    async getComments(req: Request, res: Response): Promise<void> {
        try {
            const lessonId = req.params.lessonId;
            const result=await this._mentorLessonsSerive.getComments(lessonId)
            sendResponse(res,StatusCode.OK,"Comments",true,result)
        } catch (error) {
           handleControllerError(res,error) 
        }
    }
    async genarateOptions(req: Request, res: Response): Promise<void> {
        try {
            const question = req.body.question
            const result = await this._mentorLessonsSerive.genrateOptions(question);
            sendResponse(res,StatusCode.OK,"genrate option succes fulyyyyyy",true,result)
        } catch (error) {
            handleControllerError(res,error)
        }
    }
    
}