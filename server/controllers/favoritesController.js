const pool = require("../config/db");

// POST add favorite
const addFavorite = async (req, res) => {
  const { listing_id } = req.body;
  const user_id = req.user.userId;

  try {
    // Check listing exists
    const listing = await pool.query("SELECT * FROM listings WHERE id = $1", [
      listing_id,
    ]);

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Check if already favorited
    const existing = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2",
      [user_id, listing_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Listing already saved" });
    }

    const result = await pool.query(
      `INSERT INTO favorites (user_id, listing_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, listing_id],
    );

    res
      .status(201)
      .json({ message: "Listing saved", favorite: result.rows[0] });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET all favorites for customer
const getFavorites = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT f.id, f.created_at,
              l.id AS listing_id, l.title, l.price, 
              l.location, l.bedrooms, l.bathrooms, l.property_type
       FROM favorites f
       JOIN listings l ON f.listing_id = l.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [user_id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE remove favorite
const removeFavorite = async (req, res) => {
  const { listing_id } = req.params;
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2 RETURNING *",
      [user_id, listing_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Listing removed from favorites" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
