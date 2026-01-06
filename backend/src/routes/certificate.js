import express from "express";
import { searchCertificate, downloadCertificate } from "../controllers/certController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchCertificate); // public search (or protect if desired)
router.get("/download/:certId", requireAuth, downloadCertificate); // protect download if needed

export default router;
