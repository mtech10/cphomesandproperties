import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import realtorRoutes from "./routes/realtorRoutes.js";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(cors({ origin: "https://cphomesandproperties.onrender.com" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/realtors", realtorRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
