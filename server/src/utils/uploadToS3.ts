// src/utils/s3Uploader.ts
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

export async function uploadBufferToS3(
  buffer: Buffer,
  mimetype: string,
  folder = 'uploads'
): Promise<string> {
  const ext = mimetype.split('/')[1] || 'bin';
  const key = `${folder}/${uuidv4()}.${ext}`;

  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read',
  };

  await s3.putObject(uploadParams).promise();

  return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

  await s3
    .deleteObject({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    })
    .promise();
}
