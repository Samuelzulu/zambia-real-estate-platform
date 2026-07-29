const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const agentRoutes = require("./routes/agents");
const listingRoutes = require("./routes/listings");
const inquiryRoutes = require("./routes/inquiries");
const favoriteRoutes = require("./routes/favorites");
const reportRoutes = require("./routes/reports");
const uploadRoutes = require("./routes/uploads");
const { verifyToken, requireRole } = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/uploads", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "ZRP API is running" });
});

// Protected test routes
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.get("/api/agent-only", verifyToken, requireRole("agent"), (req, res) => {
  res.json({ message: "Welcome agent", user: req.user });
});

// Database connection
const pool = require("./config/db");
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected:", res.rows[0].now);
  }
});

// Error handler — catches multer errors (file too large, wrong type, etc.)
// and anything else that reaches next(err), returning JSON instead of HTML.
app.use((err, req, res, next) => {
  if (err) {
    console.error("Unhandled error:", err.message);
    return res.status(400).json({ error: err.message || "Request failed" });
  }
  next();
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
