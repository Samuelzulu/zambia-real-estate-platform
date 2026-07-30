const express = require("express");
const router = express.Router();
const agentsController = require("../controllers/agentsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Public routes
router.get("/", agentsController.getAllAgents);
router.get("/:id", agentsController.getAgentById);

// Agent only
router.put(
  "/profile",
  verifyToken,
  requireRole("agent"),
  agentsController.updateProfile,
);

// Admin only
router.get(
  "/admin/pending",
  verifyToken,
  requireRole("admin"),
  agentsController.getPendingAgents,
);
router.put(
  "/admin/:id/verify",
  verifyToken,
  requireRole("admin"),
  agentsController.verifyAgent,
);
router.get(
  "/admin/all",
  verifyToken,
  requireRole("admin"),
  agentsController.getAllAgentsAdmin,
);
router.put(
  "/admin/:id/status",
  verifyToken,
  requireRole("admin"),
  agentsController.updateAgentStatus,
);

module.exports = router;
