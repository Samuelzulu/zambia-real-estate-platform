const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/",
  verifyToken,
  requireRole("customer"),
  favoritesController.addFavorite,
);
router.get(
  "/",
  verifyToken,
  requireRole("customer"),
  favoritesController.getFavorites,
);
router.delete(
  "/:listing_id",
  verifyToken,
  requireRole("customer"),
  favoritesController.removeFavorite,
);

module.exports = router;
