import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import connectDB from "./config/db.js";
import {
  errorResponseHandler,
  invalidPathHandler,
} from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Serveur connecté...");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur connecté sur le port ${PORT}`));
