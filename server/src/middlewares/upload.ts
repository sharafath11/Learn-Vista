import multer from "multer";

const storage = multer.memoryStorage();

// Valid file types
const PDF_MIME_TYPES = ['application/pdf'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Common upload configuration
const commonConfig = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
};

// PDF upload middleware
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

// Image upload middleware
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


export default upload;