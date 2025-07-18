import multer from "multer";
import { throwError } from "../utils/ResANDError";

const storage = multer.memoryStorage();

const PDF_MIME_TYPES = ['application/pdf'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const commonConfig = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
};

export const upload = multer({
  ...commonConfig,
  fileFilter: (req, file, cb) => {
    if (PDF_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  }
});

export const uploadImage = multer({
  
  ...commonConfig,
  fileFilter: (req, file, cb) => {
   
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      
      cb(new Error(`Only image files are allowed (${IMAGE_MIME_TYPES.join(', ')})`));
    }
  }
});

const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm'];

const ALLOWED_MIME_TYPES = [...IMAGE_MIME_TYPES, ...AUDIO_MIME_TYPES];

export const uploadConcernFiles = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only image/audio files allowed. Received: ${file.mimetype}`));
     
    }
  }
});

export default upload;