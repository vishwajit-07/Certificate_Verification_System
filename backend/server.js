import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";
import certRoutes from "./src/routes/certificate.js";


dotenv.config();
const app = express();
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "FOUND" : "MISSING");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// connect DB
await connectDB(process.env.MONGO_URI);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cert", certRoutes);

// serve generated PDFs statically if desired (careful with security)
app.use("/generated_pdfs", express.static(path.join(process.cwd(), "generated_pdfs")));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
