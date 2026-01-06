import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { api } from "@/api";

export default function SignatureUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a signature image");
      return;
    }

    const formData = new FormData();
    formData.append("signature", file);

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      await api.post(
        "/admin/upload-signature",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Signature uploaded successfully");
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Upload Admin Signature
      </h2>

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-medium
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700
                   cursor-pointer"
      />

      <Button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload Signature"}
      </Button>
    </Card>
  );
}
