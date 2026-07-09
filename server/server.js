import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import realtorRoutes from "./routes/realtorRoutes.js";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

// Requests are only accepted from these origins. Add more (e.g. a staging
// URL) as a comma-separated list in ALLOWED_ORIGINS if you ever need to.
const allowedOrigins = [
  "http://localhost:5173",
  "https://cphomesandproperties.onrender.com",
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/realtors", realtorRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
