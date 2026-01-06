import mongoose from "mongoose";

const CertSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  courseName: { type: String, required: true },
  grade: { type: String, default: "" },
  issueDate: { type: Date, default: Date.now },
  meta: { type: Object, default: {} },
  pdfPath: { type: String }
});

export default mongoose.model("Certificate", CertSchema);
