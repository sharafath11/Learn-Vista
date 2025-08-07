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
import { Messages } from "../../constants/messages";
dotenv.config();


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;



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
            sendResponse(res, StatusCode.OK,Messages.LESSONS.FETCHED , true, result);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

   
 async S3Upload(req: Request, res: Response): Promise<void> {
    const { fileName, fileType } = req.body;

    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME || !AWS_REGION) {
      return handleControllerError(
        res,
        throwError(Messages.LESSONS.AWS_CONFIG_ERROR, StatusCode.INTERNAL_SERVER_ERROR)
      );
    }
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
      Expires: 60 * 5, 
      ContentType: fileType,
    };
    s3.getSignedUrl("putObject", uploadParams, (err, signedUploadUrl) => {
      if (err) {
        return handleControllerError(res, throwError(Messages.LESSONS.UPLOAD_URL_FAILED, StatusCode.INTERNAL_SERVER_ERROR));
      }

      const publicVideoUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
      const viewParams = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Expires: 3600, 
      };

      const signedViewUrl = s3.getSignedUrl("getObject", viewParams);

      return sendResponse(res, StatusCode.OK, Messages.LESSONS.VIDEO_URL_SIGNED, true, {
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
                return handleControllerError(res, throwError(Messages.LESSONS.MISSING_FIELDS, StatusCode.BAD_REQUEST));
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

            sendResponse(res, StatusCode.CREATED, Messages.LESSONS.ADDED, true, createdLesson);

        } catch (error) {
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
        throwError(Messages.LESSONS.INVALID_ID, StatusCode.BAD_REQUEST)
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
    sendResponse(res, StatusCode.OK, Messages.LESSONS.UPDATED, true, updatedLesson);
  } catch (error) {
    handleControllerError(res, error);
  }
}


async deleteS3File(req: Request, res: Response): Promise<void> {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            return handleControllerError(res, throwError(Messages.COMMON.MISSING_FIELDS, StatusCode.BAD_REQUEST));
        }

        const s3 = new AWS.S3();
        const bucket = S3_BUCKET_NAME!;
        const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

        await s3.deleteObject({ Bucket: bucket, Key: key }).promise();

        sendResponse(res, StatusCode.OK, Messages.LESSONS.FILE_DELETED, true, null);
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
  return sendResponse(res, StatusCode.BAD_REQUEST, Messages.LESSONS.INVALID_ID, false);
}

        try {
            const token = req.cookies.token;
            if (!token) {
                throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
            }

            const mentor = decodeToken(token);
            if (!mentor || !mentor.id) {
                throwError(Messages.LESSONS.INVALID_ID, StatusCode.UNAUTHORIZED);
            }

            if (mentor.role !== "mentor") {
                throwError(Messages.COMMON.ACCESS_DENIED, StatusCode.FORBIDDEN);
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
                throwError(Messages.LESSONS.INVALID_ID, StatusCode.BAD_REQUEST);
            }
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME!, 
                Key: s3Key,
            });

            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return sendResponse(res, StatusCode.OK, Messages.LESSONS.SIGNED_URL_GENERATED, true, { signedUrl });

        } catch (error: any) {
            if (error.statusCode && error.message) {
                return sendResponse(res, error.statusCode, error.message, false);
            }
            return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, Messages.COMMON.INTERNAL_ERROR, false);
        }
     }
    async getQuestions(req: Request, res: Response): Promise<void> {
        try {
            const lessonId=req.params.lessonId
            if(!lessonId) throwError(Messages.COMMON.INTERNAL_ERROR)
            const result = await this._mentorLessonsSerive.getQuestionService(lessonId);
           sendResponse(res, StatusCode.OK, Messages.QUESTIONS.ADDED, true, result);
        } catch (error) {
            handleControllerError(res,error)
        }
    }
   async addQuestions(req: Request, res: Response): Promise<void> {
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      return sendResponse(res, StatusCode.BAD_REQUEST, Messages.LESSONS.INVALID_ID, false);
    }

    const result = await this._mentorLessonsSerive.addQuestionService(lessonId, req.body);

    if (!result) {
      throwError(Messages.COMMON.INTERNAL_ERROR, StatusCode.INTERNAL_SERVER_ERROR);
    }

    sendResponse(res, StatusCode.OK, Messages.QUESTIONS.ADDED, true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
}
   async editQuestions(req: Request, res: Response): Promise<void> {
  try {
    const questionId = req.params.questionId;

    if (!questionId) {
      return sendResponse(res, StatusCode.BAD_REQUEST, Messages.COMMON.MISSING_FIELDS, false);
    }

    await this._mentorLessonsSerive.editQuestionService(questionId, req.body);

    sendResponse(res, StatusCode.OK, Messages.QUESTIONS.UPDATED, true);
  } catch (error) {
    handleControllerError(res, error);
  }
}
async getComments(req: Request, res: Response): Promise<void> {
  try {
    const lessonId = req.params.lessonId;

    if (!lessonId) {
      return sendResponse(res, StatusCode.BAD_REQUEST, Messages.COURSE.MISSING_ID, false);
    }

    const result = await this._mentorLessonsSerive.getComments(lessonId);

    sendResponse(res, StatusCode.OK, Messages.COMMENT.FETCHED, true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
}
    async genarateOptions(req: Request, res: Response): Promise<void> {
  try {
    const question = req.body.question;

    if (!question) {
      return sendResponse(res, StatusCode.BAD_REQUEST, Messages.COMMON.MISSING_FIELDS, false);
    }

    const result = await this._mentorLessonsSerive.genrateOptions(question);

    if (!result) {
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, Messages.GENAI.GENERATE_OPTIONS_FAILED, false);
    }

    sendResponse(res, StatusCode.OK, Messages.GENAI.GENERATE_OPTIONS_SUCCESS, true, result);
  } catch (error) {
    handleControllerError(res, error);
  }
}
    
}