const express = require("express");
const router = express.Router();
const listingsController = require("../controllers/listingsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", listingsController.getAllListings);
router.get("/:id", listingsController.getListingById);
router.post(
  "/",
  verifyToken,
  requireRole("agent"),
  listingsController.createListing,
);
router.put(
  "/:id",
  verifyToken,
  requireRole("agent", "admin"),
  listingsController.updateListing,
);
router.delete(
  "/:id",
  verifyToken,
  requireRole("agent", "admin"),
  listingsController.deleteListing,
);

// Admin only — approve, reject, or unpublish any listing
router.put(
  "/admin/:id/status",
  verifyToken,
  requireRole("admin"),
  listingsController.updateListingStatus,
);

// Agent (own listing) or admin — toggle approved <-> sold
router.put(
  "/:id/sold",
  verifyToken,
  requireRole("agent", "admin"),
  listingsController.markListingSold,
);

module.exports = router;
