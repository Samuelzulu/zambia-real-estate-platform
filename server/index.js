const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const authRoutes = require("./routes/auth");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "ZRP API is running" });
});

const { verifyToken, requireRole } = require("./middleware/authMiddleware");

// Protected test route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

// Agent only route test
app.get("/api/agent-only", verifyToken, requireRole("agent"), (req, res) => {
  res.json({ message: "Welcome agent", user: req.user });
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const pool = require("./config/db");

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected:", res.rows[0].now);
  }
});
