const multer = require("multer");

// Memory storage: files stay in RAM as buffers just long enough to stream
// to Cloudinary. Nothing is ever written to Render's ephemeral disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 6, // up to 6 images per request (plenty for a listing gallery)
  },
});

module.exports = upload;
