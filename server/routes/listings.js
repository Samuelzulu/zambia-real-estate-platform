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
  requireRole("agent"),
  listingsController.updateListing,
);
router.delete(
  "/:id",
  verifyToken,
  requireRole("agent"),
  listingsController.deleteListing,
);

module.exports = router;
