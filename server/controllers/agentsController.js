const pool = require("../config/db");

// GET all verified agents
const getAllAgents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, ziea_number, verified, created_at,
              agency, bio, location, phone, photo_url,
              (SELECT COUNT(*)::int FROM listings
                 WHERE listings.agent_id = users.id AND listings.status = 'approved') AS active_listings
       FROM users 
       WHERE role = 'agent' AND verified = true AND account_status = 'active'
       ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get agents error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET single agent with their listings
const getAgentById = async (req, res) => {
  const { id } = req.params;
  try {
    const agentResult = await pool.query(
      `SELECT id, full_name, email, ziea_number, verified, created_at,
              agency, bio, location, phone, photo_url
       FROM users
       WHERE id = $1 AND role = 'agent'`,
      [id],
    );

    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const listingsResult = await pool.query(
      `SELECT * FROM listings WHERE agent_id = $1 AND status = 'approved'
       ORDER BY created_at DESC`,
      [id],
    );

    res.json({
      agent: agentResult.rows[0],
      listings: listingsResult.rows,
    });
  } catch (error) {
    console.error("Get agent error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update own profile
const updateProfile = async (req, res) => {
  const { full_name, ziea_number, agency, bio, location, phone, photo_url } =
    req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE users SET full_name = $1, ziea_number = $2, agency = $3,
              bio = $4, location = $5, phone = $6, photo_url = $7
       WHERE id = $8
       RETURNING id, full_name, email, role, ziea_number, verified,
                 agency, bio, location, phone, photo_url, created_at`,
      [full_name, ziea_number, agency, bio, location, phone, photo_url, userId],
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET pending agents (admin only)
const getPendingAgents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, ziea_number, created_at
       FROM users
       WHERE role = 'agent' AND verified = false
       ORDER BY created_at ASC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get pending agents error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT verify or reject agent (admin only)
const verifyAgent = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET verified = $1
       WHERE id = $2 AND role = 'agent'
       RETURNING id, full_name, email, ziea_number, verified`,
      [verified, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const message = verified ? "Agent verified successfully" : "Agent rejected";
    res.json({ message, agent: result.rows[0] });
  } catch (error) {
    console.error("Verify agent error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET all agents for admin management (any verified/account_status)
const getAllAgentsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, ziea_number, verified, account_status, created_at,
              agency, bio, location, phone, photo_url,
              (SELECT COUNT(*)::int FROM listings
                 WHERE listings.agent_id = users.id AND listings.status = 'approved') AS active_listings
       FROM users
       WHERE role = 'agent'
       ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get all agents (admin) error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT suspend or reactivate an agent (admin only). Suspending pulls their
// approved listings from public view; reactivating restores them.
const updateAgentStatus = async (req, res) => {
  const { id } = req.params;
  const { account_status } = req.body;

  if (!["active", "suspended"].includes(account_status)) {
    return res.status(400).json({ error: "Invalid account_status" });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET account_status = $1
       WHERE id = $2 AND role = 'agent'
       RETURNING id, full_name, email, account_status`,
      [account_status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    if (account_status === "suspended") {
      await pool.query(
        `UPDATE listings SET status = 'unpublished'
         WHERE agent_id = $1 AND status = 'approved'`,
        [id],
      );
    } else {
      await pool.query(
        `UPDATE listings SET status = 'approved'
         WHERE agent_id = $1 AND status = 'unpublished'`,
        [id],
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update agent status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllAgents,
  getAgentById,
  updateProfile,
  getPendingAgents,
  verifyAgent,
  getAllAgentsAdmin,
  updateAgentStatus,
};
