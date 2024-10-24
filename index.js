import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
import "./db.js";
import faq from "./routes/faqRoutes.js";
import nautikaAdmin from "./routes/nautikaAdminRoutes.js";
import nautikaPublic from "./routes/nautikaPublicRoutes.js";
import ts from "./routes/nautikaTeamSocialRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(morgan("tiny"));

morgan.token("host", function (req, res) {
  return req.hostname;
});

app.use(cors());

// Define __dirname using fileURLToPath and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 5001;

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// New Nautika Blog routes
app.use("/admin/nautika", nautikaAdmin); // Admin routes for Nautika Blog without token
app.use("/admin", nautikaAdmin); // Admin routes for Nautika Blog without token
// app.use("/admin/nautika", verifyToken,nautikaAdmin);  // Admin routes for Nautika Blog with token if you want to enable open comment out this comment the above one it will work.
app.use("/api/nautika", nautikaPublic); // Public routes for Nautika Blog
app.use("/api/nautika/faq", faq);
app.use("/api/nautika/ts", ts);

app.listen(port, () => console.log(`server listening on port ${port}`));
