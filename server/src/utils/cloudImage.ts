import { v2 as cloudinary } from 'cloudinary';
import { promisify } from 'util';
import stream from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export async function uploadToCloudinary(imageBuffer: Buffer, folder = 'profile_pictures'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) return reject(new Error('Upload failed'));
        resolve(result.secure_url);
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);
    bufferStream.pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  const parts = url.split('/');
  const fileName = parts.pop()?.split('.')[0];
  const folder = parts.slice(parts.indexOf('upload') + 1).join('/');
  const publicId = `${folder}/${fileName}`;

  if (!fileName) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting Cloudinary asset:', error);
  }
}
