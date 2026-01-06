import User from "../models/User.js";
import Certificate from "../models/Certificate.js";
import xlsx from "xlsx";
import { generateCertificatePdf } from "../utils/generateCertificatePdf.js";



const makeCertId = (courseName) => {
  const timePart = Date.now().toString();
  const rand = Math.random().toString(36).slice(2, 6);
  const safeCourse = String(courseName || "Course").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  return `${safeCourse}_${timePart.slice(-8)}_${rand}`;
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Allow only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin deleting himself (recommended)
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete own account",
      });
    }
    
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const bulkUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Excel file required" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const results = { created: [], skipped: [], errors: [] };
    const adminSignature = req.user?.signaturePath || "";

    for (let row of rows) {
      try {
        const name = String(row.name || row.studentName || row.Name || "").trim();
        const email = String(row.email || row.Email || "").trim().toLowerCase();
        const courseName = String(row.courseName || row.course || row.course_name || "Course").trim();
        const grade = String(row.grade || row.marks || row.score || "").trim();
        let certId = String(row.certId || row.certID || row.certid || "").trim();

        if (!name || !email) {
          results.errors.push({ row, reason: "Missing name or email" });
          continue;
        }

        if (!certId) certId = makeCertId(courseName);

        const existingCert = await Certificate.findOne({ certId });
        if (existingCert) {
          results.skipped.push({ email, certId, reason: "Certificate ID exists" });
          continue;
        }

        const existingUser = await User.findOne({ email });
        let user;
        if (!existingUser) {
          const randomPassword = Math.random().toString(36).slice(2, 10);
          user = new User({ name, email, password: randomPassword, role: "student" });
          await user.save();
        } else {
          user = existingUser;
        }

        const issueDate = new Date();
        const cert = new Certificate({
          certId,
          studentName: name,
          studentEmail: email,
          courseName,
          grade,
          issueDate
        });

        const pdfPath = await generateCertificatePdf({
          certId,
          studentName: name,
          courseName,
          grade,
          issueDate,
          signaturePath: adminSignature
        });

        cert.pdfPath = pdfPath;
        await cert.save();

        results.created.push({ email, certId });
      } catch (errInner) {
        results.errors.push({ row, reason: errInner.message });
      }
    }

    res.json({ message: "Upload processed", results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createCertificate = async (req, res) => {
  try {
    const { certId, studentName, studentEmail, courseName, grade } = req.body;
    if (!studentName || !studentEmail || !courseName) return res.status(400).json({ message: "Missing fields" });

    const id = certId && String(certId).trim() ? String(certId).trim() : makeCertId(courseName);
    const exists = await Certificate.findOne({ certId: id });
    if (exists) return res.status(400).json({ message: "Certificate ID already exists" });

    const issueDate = new Date();
    const cert = new Certificate({ certId: id, studentName, studentEmail, courseName, grade, issueDate });

    const adminSignature = req.user?.signaturePath || "";
    const pdfPath = await generateCertificatePdf({ certId: id, studentName, courseName, grade, issueDate, signaturePath: adminSignature });

    cert.pdfPath = pdfPath;
    await cert.save();

    res.json({ message: "Certificate created", cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listUsers = async (req, res) => {
  const users = await User.find({ role: "student" })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();
  res.json({ users });
};



export const uploadSignature = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Signature image required" });
    const sigPath = path.join(process.cwd(), req.file.destination, req.file.filename);
    const admin = await User.findById(req.user._id);
    admin.signaturePath = sigPath;
    await admin.save();
    res.json({ message: "Signature uploaded", signaturePath: sigPath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};