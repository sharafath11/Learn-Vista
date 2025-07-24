import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../config/AWS";

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

export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    console.log(`Successfully deleted ${fileUrl} from S3.`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${fileUrl}`, error);
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

export async function uploadThumbnail(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  return uploadBufferToS3(buffer, mimetype, "thumbnails");
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
