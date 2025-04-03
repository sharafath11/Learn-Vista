import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("application/pdf")) {
      return cb(null, false); 
    }
    cb(null, true);
  },
});

export default upload;
