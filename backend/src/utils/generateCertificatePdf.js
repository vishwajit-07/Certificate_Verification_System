import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificatePdf = async (data, outDir = "generated_pdfs") => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const fileName = `${data.certId}.pdf`;
  const outPath = path.join(outDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    doc.fontSize(28).text("Certificate of Completion", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(14).text("This is to certify that", { align: "center" });
    doc.moveDown(0.7);

    doc.fontSize(22).text(data.studentName, { align: "center", underline: true });
    doc.moveDown(0.8);

    doc.fontSize(14).text(`has successfully completed the course`, { align: "center" });
    doc.moveDown(0.6);

    doc.fontSize(18).text(data.courseName, { align: "center" });
    doc.moveDown(0.8);

    if (data.grade) {
      doc.fontSize(14).text(`Grade: ${data.grade}`, { align: "center" });
      doc.moveDown(0.6);
    }

    doc.moveDown(1);

    const leftX = doc.page.margins.left;
    doc.fontSize(10).text(`Certificate ID: ${data.certId}`, leftX, doc.y);
    doc.moveDown(0.2);
    doc.fontSize(10).text(`Issue Date: ${new Date(data.issueDate).toLocaleDateString()}`, leftX, doc.y);
    doc.moveDown(2);

    if (data.signaturePath && fs.existsSync(data.signaturePath)) {
      try {
        const sigBoxWidth = 150;
        const sigBoxHeight = 60;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const x = doc.page.margins.left + pageWidth - sigBoxWidth;
        const y = doc.page.height - doc.page.margins.bottom - sigBoxHeight - 50;
        doc.image(data.signaturePath, x, y, { width: sigBoxWidth, height: sigBoxHeight });
        doc.fontSize(10).text("Authorized Signature", x, y + sigBoxHeight + 6, { width: sigBoxWidth, align: "center" });
      } catch (e) {
        doc.moveDown(2);
        doc.fontSize(10).text("Signature: ____________________", { align: "right" });
      }
    } else {
      doc.moveDown(2);
      doc.fontSize(10).text("Signature: ____________________", { align: "right" });
    }

    doc.end();

    stream.on("finish", () => resolve(outPath));
    stream.on("error", (err) => reject(err));
  });
};
