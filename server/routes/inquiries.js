const express = require("express");
const router = express.Router();
const inquiriesController = require("../controllers/inquiriesController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/",
  verifyToken,
  requireRole("customer"),
  inquiriesController.createInquiry,
);
router.get(
  "/my",
  verifyToken,
  requireRole("customer"),
  inquiriesController.getMyInquiries,
);
router.get(
  "/agent",
  verifyToken,
  requireRole("agent"),
  inquiriesController.getAgentInquiries,
);

module.exports = router;
