import express from "express";
import { bulkUpload, createCertificate, listUsers, deleteUser } from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadExcel.js";
import { uploadSignature } from "../controllers/adminController.js";
import multer from "multer";

const router = express.Router();

router.post("/upload-excel", requireAuth, requireAdmin, upload.single("file"), bulkUpload);
router.post("/create-certificate", requireAuth, requireAdmin, createCertificate);
router.get("/users", requireAuth, requireAdmin, listUsers);
router.delete("/user/:userId", requireAuth, requireAdmin, deleteUser);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "signatures");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${req.user._id}_signature.${ext}`);
  }
});
const uploadSig = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) cb(new Error("Only images allowed"), false);
    else cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 }
});

router.post("/upload-signature", requireAuth, requireAdmin, uploadSig.single("signature"), uploadSignature);

export default router;
