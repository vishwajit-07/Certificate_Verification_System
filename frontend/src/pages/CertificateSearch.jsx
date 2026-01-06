import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CertificateSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;

    if (!parsed || parsed.role !== "student") {
      nav("/login");
    }
  }, [nav]);

  const search = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("Please enter a certificate ID or student name");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const base =
        import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

      const res = await fetch(
        `${base}/cert/search?q=${encodeURIComponent(query.trim())}`
      );

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();
      setResult(data);

      if (data?.cert) {
        toast.success("Certificate found");
      } else if (data?.message) {
        toast(data.message, { icon: "ℹ️" });
      } else {
        toast("No matching certificate found", { icon: "ℹ️" });
      }
    } catch (err) {
      toast.error("Something went wrong while searching");
    } finally {
      setLoading(false);
    }
  };

  const viewCertificate = () => {
    const stored = sessionStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;

    if (!parsed) return nav("/login");
    if (!result?.cert?.certId) {
      toast.error("No certificate selected");
      return;
    }

    nav(`/cert/${result.cert.certId}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-white border border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-gray-800">
              Search Certificate
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your certificate ID or student name to find your certificate.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              onSubmit={search}
              className="flex flex-col sm:flex-row gap-3 items-stretch"
            >
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor="query"
                  className="text-sm text-gray-700"
                >
                  Certificate ID / Student Name
                </Label>
                <Input
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. CERT1234 or John Doe"
                  className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 text-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm h-10"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Searching...
                    </span>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </form>

            {result?.cert && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {result.cert.studentName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Certificate ID:{" "}
                      <span className="font-mono text-gray-800">
                        {result.cert.certId}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">Course:</span>{" "}
                      {result.cert.courseName}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Grade:</span>{" "}
                      {result.cert.grade || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Issue Date:
                      </span>{" "}
                      {new Date(
                        result.cert.issueDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={viewCertificate}
                    className="bg-emerald-600 hover:bg-emerald-700 text-sm h-9"
                  >
                    View / Download
                  </Button>
                </div>
              </motion.div>
            )}

            {result?.message && !result?.cert && (
              <div className="text-sm text-gray-600">
                {result.message}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
