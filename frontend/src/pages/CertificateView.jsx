import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CertificateView() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE || "http://localhost:5000/api"}/cert/search?q=${encodeURIComponent(certId)}`
        );
        const data = await res.json();
        if (data?.cert) setCert(data.cert);
      } finally {
        setLoading(false);
      }
    })();
  }, [certId]);

  const download = async () => {
    try {
      const blob = await api.download(`/cert/download/${certId}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please login again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 text-gray-600">
        Loading certificate...
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 text-gray-600">
        Certificate not found
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-8 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white border border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">
              Certificate Details
            </CardTitle>
            <CardDescription className="text-gray-500">
              Verify and download your certificate.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-gray-800">Student Name:</span>{" "}
              {cert.studentName}
            </div>

            <div>
              <span className="font-medium text-gray-800">Certificate ID:</span>{" "}
              <span className="font-mono">{cert.certId}</span>
            </div>

            <div>
              <span className="font-medium text-gray-800">Course:</span>{" "}
              {cert.courseName}
            </div>

            <div>
              <span className="font-medium text-gray-800">Grade:</span>{" "}
              {cert.grade || "N/A"}
            </div>

            <div>
              <span className="font-medium text-gray-800">Issue Date:</span>{" "}
              {new Date(cert.issueDate).toLocaleDateString()}
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={download}
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
