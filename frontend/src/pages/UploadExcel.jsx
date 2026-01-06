import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an Excel file");

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      const res = await api.postFormData("/admin/upload-excel", fd);
      setResult(res);
      toast.success("Excel uploaded successfully");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="bg-white border border-gray-200 shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Upload Excel File
          </CardTitle>
          <CardDescription className="text-gray-500">
            Upload .xlsx or .xls file to generate certificates.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-sm text-gray-700">
                Select Excel File
              </Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="cursor-pointer bg-gray-50 border-gray-300 text-gray-700 file:bg-blue-600 file:text-white file:rounded-md file:px-3 file:py-1 file:border-0 file:hover:bg-blue-700"
              />
            </div>

            <motion.div whileHover={{ scale: !loading ? 1.02 : 1 }} whileTap={{ scale: !loading ? 0.97 : 1 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Uploading...
                  </span>
                ) : (
                  "Upload File"
                )}
              </Button>
            </motion.div>
          </form>

          {result && (
            <div className="mt-6 bg-gray-50 border border-gray-200 p-3 rounded-md max-h-64 overflow-auto text-sm text-gray-700">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
