const pool = require("../config/db");

// POST create inquiry
const createInquiry = async (req, res) => {
  const { listing_id, message } = req.body;
  const user_id = req.user.userId;

  try {
    // Check listing exists
    const listing = await pool.query("SELECT * FROM listings WHERE id = $1", [
      listing_id,
    ]);

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const result = await pool.query(
      `INSERT INTO inquiries (user_id, listing_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, listing_id, message],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET customer's own inquiries
const getMyInquiries = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT i.id, i.message, i.created_at,
              l.title AS listing_title, l.location,
              u.full_name AS agent_name
       FROM inquiries i
       JOIN listings l ON i.listing_id = l.id
       JOIN users u ON l.agent_id = u.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get my inquiries error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET inquiries for agent's listings
const getAgentInquiries = async (req, res) => {
  const agent_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT i.id, i.message, i.created_at,
              l.title AS listing_title,
              u.full_name AS customer_name, u.email AS customer_email
       FROM inquiries i
       JOIN listings l ON i.listing_id = l.id
       JOIN users u ON i.user_id = u.id
       WHERE l.agent_id = $1
       ORDER BY i.created_at DESC`,
      [agent_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get agent inquiries error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createInquiry, getMyInquiries, getAgentInquiries };
