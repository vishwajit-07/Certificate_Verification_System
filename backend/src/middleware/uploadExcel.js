import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory for parsing
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
