import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "./db.js";
import user from "./routes/userRoute.js";
import admin from "./routes/adminRoute.js";
import nautikaAdmin from "./routes/nautikaAdminRoutes.js";
import nautikaPublic from "./routes/nautikaPublicRoutes.js";
import faq from "./routes/faqRoutes.js";
import ts from "./routes/nautikaTeamSocialRoutes.js";
import contact from "./routes/contactRoutes.js";
import policies from "./routes/policyRoutes.js";
import utm from "./routes/utmRoutes.js";
import newsletter from "./routes/newsletterRoutes.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';  // Import fileURLToPath
import { dirname } from 'path';       // Import dirname

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/user", user);
app.use("/admin", admin);

app.use("/contact", contact);
app.use("/policies", policies);
app.use("/utm", utm);
app.use("/newsletter", newsletter);


// New Nautika Blog routes
app.use("/admin/nautika", nautikaAdmin);  // Admin routes for Nautika Blog
app.use("/api/nautika", nautikaPublic);   // Public routes for Nautika Blog
app.use("/api/nautika/faq", faq);
app.use("/api/nautika/ts", ts);

app.listen(port, () => console.log(`server listening on port ${port}`));
