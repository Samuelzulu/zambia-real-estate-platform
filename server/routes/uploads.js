const express = require("express");
const router = express.Router();
const uploadsController = require("../controllers/uploadsController");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/uploads — logged-in users only (agents uploading listing or
// profile photos). Accepts up to 6 files under the "images" field.
router.post(
  "/",
  verifyToken,
  upload.array("images", 6),
  uploadsController.uploadImages,
);

module.exports = router;
