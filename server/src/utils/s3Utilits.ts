import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../config/AWS";
import { fileTypeFromBuffer } from "file-type";
import { IConcern } from "../types/concernTypes";
import { logger } from "./logger";
import { IDailyTask, ISubTask, ISubTaskWithSignedUrl } from "../types/dailyTaskType";

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';

export async function uploadBufferToS3(
  buffer: Buffer,
  mimetype: string,
  folder: string
): Promise<string> {
  const ext = mimetype.split("/")[1] || "bin";
  const key = `${folder}/${uuidv4()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });
  try {
    await s3.send(command);
    return key;
  } catch (error) {
    console.error(`Error uploading file to S3 in folder ${folder}:`, error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteFromS3(s3Key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
    });
    await s3.send(command);
  } catch (error) {
    console.error(`Error deleting file from S3: ${s3Key}`, error);
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getSignedS3Url(
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });
  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for key ${key}:`, error);
    throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function uploadProfilePicture(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  return uploadBufferToS3(buffer, mimetype, "profile_pictures");
}

export async function uploadThumbnail(buffer: Buffer): Promise<string> {
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !fileType.mime.startsWith("image/")) {
    throw new Error("Invalid image file");
  }
  return uploadBufferToS3(buffer, fileType.mime, "thumbnails");
}

export async function uploadPdf(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  if (mimetype !== "application/pdf") {
    throw new Error("Invalid MIME type for PDF upload. Expected 'application/pdf'.");
  }
  return uploadBufferToS3(buffer, mimetype, "pdfs");
}

export async function uploadConcernAttachment(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  const folder = mimetype.startsWith("image") ? "mentor_concerns/images" : "mentor_concerns/audio";
  return uploadBufferToS3(buffer, mimetype, folder);
}

export const convertSignedUrlInArray = async <T extends Record<string, any>>(
  items: T[],
  keysToSign: (keyof T)[]
): Promise<T[]> => {
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const updatedItem = { ...item };
      for (const key of keysToSign) {
        const value = item[key];
        if (
          typeof value === "string" &&
          !value.startsWith("http://") && 
          !value.startsWith("https://") && 
          (value.includes("/") || value.includes(".")) 
        ) {
          try {
            const signedUrl = await getSignedS3Url(value);
            updatedItem[key] = signedUrl as T[keyof T];
          } catch (error) {
            logger.warn(`Could not generate signed URL for key: ${value}. Error: ${error}`);
          }
        }
      }
      return updatedItem;
    })
  );
  return updatedItems;
};


export const convertSignedUrlInObject = async <T extends Record<string, any>>(
  item: T,
  keysToSign: (keyof T)[]
): Promise<T> => {
  const updatedItem = { ...item };
  for (const key of keysToSign) {
    const value = updatedItem[key];
    if (
      typeof value === "string" &&
      !value.startsWith("http://") &&
      !value.startsWith("https://") &&
      (value.includes("/") || value.includes("."))
    ) {
      try {
        const signedUrl = await getSignedS3Url(value);
        updatedItem[key] = signedUrl as T[keyof T];
      } catch (error) {
        logger.warn(`Could not generate signed URL for key: ${value}. Error: ${error}`);
      }
    }
  }
  return updatedItem;
};

export async function signConcernAttachmentUrls(data: IConcern[]): Promise<IConcern[]> {
  for (const concern of data) {
    if (Array.isArray(concern.attachments)) {
      for (const attachment of concern.attachments) {
        try {
          attachment.url = await getSignedS3Url(attachment.url);
        } catch (err) {
          logger.warn(`Failed to sign URL for ${attachment.filename}:`, err);
          attachment.url = "";
        }
      }
    }
  }
  return data;
}

function extractS3KeyFromUrl(videoUrl: string): string {
  let s3Key = videoUrl;
  const bucketDomain = `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
  const pathStyleDomain = `s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`;

  if (videoUrl.startsWith(`https://${bucketDomain}/`)) {
    s3Key = videoUrl.substring(`https://${bucketDomain}/`.length);
  } else if (videoUrl.startsWith(`https://${pathStyleDomain}/`)) {
    s3Key = videoUrl.substring(`https://${pathStyleDomain}/`.length);
  } else {
    logger.warn("Video URL not in expected S3 URL format. Assuming it's already an S3 Key:", videoUrl);
  }

  return s3Key;
}

export async function generateSignedUrlForVideo(
  videoUrl: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const s3Key = extractS3KeyFromUrl(videoUrl);
  return getSignedS3Url(s3Key, expiresInSeconds);
}

export async function uploadDailyTaskAudio(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  if (!mimetype.startsWith("audio/")) {
    throw new Error("Invalid MIME type for daily task audio upload. Expected audio type.");
  }
  return uploadBufferToS3(buffer, mimetype, "daily_tasks/audio");
}


export async function generateSignedUrlForVideoFieldInObjects<T extends object>(
  items: T[],
  keys: (keyof T)[],
  expiresInSeconds: number = 3600
): Promise<T[]> {
  return await Promise.all(
    items.map(async (item) => {
      const updatedItem = { ...item };

      for (const key of keys) {
        const value = item[key];

        if (typeof value === "string" && value.includes("amazonaws.com")) {
          try {
            const s3Key = extractS3KeyFromUrl(value);
            const signedUrl = await getSignedS3Url(s3Key, expiresInSeconds);
            (updatedItem as Record<typeof key, string>)[key] = signedUrl;
          } catch (err) {
            logger.warn(`Failed to sign URL for key "${String(key)}"`, err);
            (updatedItem as Record<typeof key, string>)[key] = "";
          }
        }
      }

      return updatedItem;
    })
  );
}
export const addSignedUrlToTask = async (task: ISubTask): Promise<ISubTask> => {
  if (task.type === "speaking" && task.userResponse) {
    const signedUrl = await getSignedS3Url(task.userResponse);
    return {
      ...task,
      userResponse: signedUrl,
    };
  }
  return task;
};

export const updateDailyTaskWithSignedUrls = async (
  dailyTask: IDailyTask
): Promise<IDailyTask> => {
  dailyTask.tasks = await Promise.all(dailyTask.tasks.map(addSignedUrlToTask));
  return dailyTask;
};
