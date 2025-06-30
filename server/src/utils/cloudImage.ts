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

  if (!fileName) {
    console.warn('Filename could not be determined from the URL.');
    return;
  }

  const folderParts = parts.slice(parts.indexOf('upload') + 1);

  if (folderParts[0]?.startsWith('v') && !isNaN(Number(folderParts[0].substring(1)))) {
    folderParts.shift();
  }

  const folder = folderParts.join('/');
  const publicId = `${folder}/${fileName}`;



  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  

    if (result.result !== 'ok') {
      console.warn(' Cloudinary did not delete the image. Result:', result);
    }
  } catch (error) {
    console.error(' Error deleting Cloudinary asset:', error);
  }
}

export async function uploadConcernAttachmentToCloudinary(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  const resourceType =
    mimetype.startsWith('image/') ? 'image' :
    mimetype.startsWith('audio/') ? 'video' : 
    'auto'

  const folder =
    mimetype.startsWith('image/') ? 'concern_attachments/images' :
    mimetype.startsWith('audio/') ? 'concern_attachments/audio' :
    'concern_attachments/other'

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error)
        if (!result?.secure_url) return reject(new Error('Upload failed'))
        resolve(result.secure_url)
      }
    )

    const bufferStream = new stream.PassThrough()
    bufferStream.end(buffer)
    bufferStream.pipe(uploadStream)
  })
}
