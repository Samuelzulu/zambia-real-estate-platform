const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Uploads a single file buffer to Cloudinary and resolves with the result.
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// POST /api/uploads
// Accepts one or more files under the "images" field (multipart/form-data).
// Returns { urls: [...] } — always an array, even for a single file, so the
// frontend has one consistent shape to work with.
const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const uploads = await Promise.all(
      req.files.map((file) => streamUpload(file.buffer, "zrp")),
    );
    const urls = uploads.map((result) => result.secure_url);
    res.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
};

module.exports = { uploadImages };
