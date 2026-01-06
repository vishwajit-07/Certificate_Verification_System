import Certificate from "../models/Certificate.js";
import path from "path";
import fs from "fs";

export const searchCertificate = async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ message: "search query required" });

  const cert = await Certificate.findOne({
    $or: [
      { certId: q },
      { studentName: { $regex: q, $options: "i" } }
    ]
  }).lean();

  if (!cert) return res.status(404).json({ message: "No certificate found" });

  res.json({ cert });
};

export const downloadCertificate = async (req, res) => {
  const { certId } = req.params;
  const cert = await Certificate.findOne({ certId });
  if (!cert) return res.status(404).json({ message: "Certificate not found" });

  if (cert.pdfPath && fs.existsSync(cert.pdfPath)) {
    return res.download(cert.pdfPath, `${certId}.pdf`);
  }

  return res.status(404).json({ message: "PDF not found on server" });
};
