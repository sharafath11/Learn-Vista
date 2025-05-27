import { inject, injectable } from "inversify";
import { IMentorLessonsController } from "../../core/interfaces/controllers/mentor/IMentorLesson.Controller";
import { TYPES } from "../../core/types";
import { Request, Response } from "express";
import { IMentorLessonService } from "../../core/interfaces/services/mentor/IMentorLesson.Service";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

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
        console.log(`[S3Upload] Received request for file: ${fileName} (Type: ${fileType})`);

        if (!fileName || !fileType) {
            return handleControllerError(res, throwError("File name and fileType are required in the request body.", StatusCode.BAD_REQUEST));
        }

        if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
            console.error('[S3Upload] Missing AWS S3 configuration.');
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
            Expires: 60 * 5, // URL valid for 5 minutes
            ContentType: fileType,
            // REMOVE THIS LINE: ACL: 'public-read'
        };

        s3.getSignedUrl('putObject', params, (err, uploadURL) => {
            if (err) {
                console.error('[S3Upload] Error generating S3 pre-signed URL:', err);
                return handleControllerError(res, throwError("Failed to generate S3 pre-signed URL.", StatusCode.INTERNAL_SERVER_ERROR));
            }

            const publicVideoUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
            console.log(`[S3Upload] Generated pre-signed URL: ${uploadURL}`);
            console.log(`[S3Upload] Public video URL: ${publicVideoUrl}`);

            // Sending both the signed URL for upload and the public URL for storage/display
            sendResponse(res, StatusCode.OK, "", true, { signedUploadUrl: uploadURL, publicVideoUrl: publicVideoUrl });
        });
    }
    async addLesson(req: Request, res: Response): Promise<void> {
    try {
        const { courseId, lesson } = req.body;
        const result = await this._mentorLessonsSerive.addLesson(courseId, lesson);
        sendResponse(res, StatusCode.CREATED, "Lesson added successfully", true, result);
    } catch (error) {
        handleControllerError(res, error);
    }
}

async editLesson(req: Request, res: Response): Promise<void> {
    try {
        const { lessonId, updateLesson } = req.body;
        const result = await this._mentorLessonsSerive.editLesson(lessonId, updateLesson);
        sendResponse(res, StatusCode.OK, "Lesson updated successfully", true, result);
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
        // Decode the URL to get the correct S3 key (pathname without leading slash)
        const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

        await s3.deleteObject({ Bucket: bucket, Key: key }).promise();

        sendResponse(res, StatusCode.OK, "File deleted successfully", true, null);
    } catch (error) {
        handleControllerError(res, error);
    }
}
}