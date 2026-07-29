const pool = require("../config/db");

// GET all listings
const getAllListings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM listings ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET single listing
const getListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM listings WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create listing
const createListing = async (req, res) => {
  const {
    title,
    description,
    price,
    location,
    bedrooms,
    bathrooms,
    property_type,
    images,
    square_footage,
    year_built,
  } = req.body;
  const agent_id = req.user.userId;

  try {
    const result = await pool.query(
      `INSERT INTO listings 
        (title, description, price, location, bedrooms, bathrooms, property_type, agent_id, images, square_footage, year_built)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        title,
        description,
        price,
        location,
        bedrooms,
        bathrooms,
        property_type,
        agent_id,
        JSON.stringify(images || []),
        square_footage || null,
        year_built || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update listing
const updateListing = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    location,
    bedrooms,
    bathrooms,
    property_type,
    images,
    square_footage,
    year_built,
  } = req.body;
  const agent_id = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE listings SET
        title = $1, description = $2, price = $3, location = $4,
        bedrooms = $5, bathrooms = $6, property_type = $7, images = $8,
        square_footage = $9, year_built = $10
       WHERE id = $11 AND agent_id = $12
       RETURNING *`,
      [
        title,
        description,
        price,
        location,
        bedrooms,
        bathrooms,
        property_type,
        JSON.stringify(images || []),
        square_footage || null,
        year_built || null,
        id,
        agent_id,
      ],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Listing not found or not authorized" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE listing
const deleteListing = async (req, res) => {
  const { id } = req.params;
  const agent_id = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 AND agent_id = $2 RETURNING *",
      [id, agent_id],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Listing not found or not authorized" });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
