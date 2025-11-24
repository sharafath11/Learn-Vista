// // src/utils/s3Uploader.ts (Refactored to AWS SDK V3)

// import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';
// // You likely need to define your S3 Client globally, or import it from a config file.
// // Assuming your config/AWS.ts exports the S3Client instance as 's3':
// // If you don't have a config file, initialize the client here:
// // const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-south-1' });

// // --- Assuming you define the S3 Client once globally ---
// const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
// const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// // --- Initialize S3Client (V3) ---
// // This client will automatically use the EC2 IAM Role credentials.
// const s3 = new S3Client({ region: AWS_REGION });

// // --- Export Functions ---

// export async function uploadBufferToS3(
//   buffer: Buffer,
//   mimetype: string,
//   folder = 'uploads'
// ): Promise<string> {
//   const ext = mimetype.split('/')[1] || 'bin';
//   const key = `${folder}/${uuidv4()}.${ext}`;

//   const command = new PutObjectCommand({
//     Bucket: S3_BUCKET_NAME,
//     Key: key,
//     Body: buffer,
//     ContentType: mimetype,
//     ACL: 'public-read', // Note: ACLs are often disabled in modern S3 config
//   });

//   await s3.send(command);

//   // Return the public URL
//   return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
// }

// export async function deleteFromS3(fileUrl: string): Promise<void> {
//   // Use URL parsing logic (assuming the URL is correctly structured)
//   const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

//   const command = new DeleteObjectCommand({
//     Bucket: S3_BUCKET_NAME,
//     Key: key,
//   });

//   await s3.send(command);
// }