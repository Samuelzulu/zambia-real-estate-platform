const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/",
  verifyToken,
  requireRole("customer"),
  reportsController.createReport,
);
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  reportsController.getAllReports,
);
router.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  reportsController.updateReportStatus,
);

module.exports = router;
