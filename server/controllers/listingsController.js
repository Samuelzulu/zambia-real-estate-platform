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
    // Verified agents' listings publish immediately, unless the agent is
    // currently suspended — suspension should always win over auto-approve.
    const agentResult = await pool.query(
      "SELECT verified, account_status FROM users WHERE id = $1",
      [agent_id],
    );
    const agent = agentResult.rows[0];
    const status =
      agent?.verified && agent?.account_status !== "suspended"
        ? "approved"
        : "pending";

    const result = await pool.query(
      `INSERT INTO listings 
        (title, description, price, location, bedrooms, bathrooms, property_type, agent_id, images, square_footage, year_built, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        status,
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
  const isAdmin = req.user.role === "admin";

  try {
    const values = [
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
    ];
    // When an agent edits their own rejected/unpublished listing, treat it
    // as a resubmission — bump it back to pending and clear the old reason.
    // Admin edits (e.g. fixing a typo on someone's behalf) never trigger this.
    const statusClause = isAdmin
      ? ""
      : `, status = CASE WHEN status IN ('rejected', 'unpublished') THEN 'pending' ELSE status END,
         rejection_reason = CASE WHEN status IN ('rejected', 'unpublished') THEN NULL ELSE rejection_reason END`;

    let query = `UPDATE listings SET
        title = $1, description = $2, price = $3, location = $4,
        bedrooms = $5, bathrooms = $6, property_type = $7, images = $8,
        square_footage = $9, year_built = $10${statusClause}
       WHERE id = $11`;
    if (!isAdmin) {
      query += ` AND agent_id = $12`;
      values.push(agent_id);
    }
    query += ` RETURNING *`;

    const result = await pool.query(query, values);
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
  const isAdmin = req.user.role === "admin";

  try {
    let query = "DELETE FROM listings WHERE id = $1";
    const values = [id];
    if (!isAdmin) {
      query += " AND agent_id = $2";
      values.push(agent_id);
    }
    query += " RETURNING *";

    const result = await pool.query(query, values);
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

// PUT set listing status directly (admin only) — approve, reject, or
// unpublish any listing regardless of who owns it.
const updateListingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const allowed = ["pending", "approved", "rejected", "unpublished"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  if (status === "rejected" && !reason?.trim()) {
    return res
      .status(400)
      .json({ error: "A reason is required when rejecting a listing" });
  }

  try {
    const result = await pool.query(
      `UPDATE listings SET status = $1, rejection_reason = $2
       WHERE id = $3 RETURNING *`,
      [status, status === "rejected" ? reason.trim() : null, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update listing status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  updateListingStatus,
};
