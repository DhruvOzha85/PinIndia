require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");

const statesRouter = require("./routes/states");
const pincodesRouter = require("./routes/pincodes");
const statsRouter = require("./routes/stats");
const exportRouter = require("./routes/export");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ───── High Priority Specific Routes ─────
app.use("/api/states", statesRouter);
app.use("/api/pincodes", pincodesRouter);
app.use("/api/pincode", pincodesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/export", exportRouter);

app.use("/api/search", (req, res, next) => {
  req.url = "/search" + (req.url === "/" ? "" : req.url);
  pincodesRouter(req, res, next);
});

// ───── Low Priority / Fallback Routes (Postman ease) ─────
// NOTE: Must be after specific routes to avoid matching /api/stats as /api/:pincode
app.use("/api", pincodesRouter); 
app.use("/states", statesRouter);
app.use("/pincode", pincodesRouter);
app.use("/pincodes", pincodesRouter);

// Health check
app.get("/", (req, res) => res.json({ status: "Indian Pincode API running 🚀" }));

// Error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
