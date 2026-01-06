import React, { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import UploadExcel from "./UploadExcel";
import ManageUsers from "./ManageUsers";
import SignatureUpload from "../components/SignatureUpload";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard({ user }) {
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;

    if (!parsed || parsed.role !== "admin") {
      nav("/login");
    }
  }, [nav]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-8 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl"
      >
        <Card className="bg-white border border-gray-200 shadow-xl">
          {/* Header */}
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-gray-800">
                Admin Dashboard
              </CardTitle>
              <CardDescription className="text-gray-500">
                Manage certificates and users from a single panel.
              </CardDescription>
            </div>

            <div className="text-sm text-gray-600">
              Logged in as{" "}
              <span className="font-semibold text-gray-800">
                {user.name || "Admin"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
              <NavLink to="/admin/upload">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full px-4 text-sm ${
                    location.pathname.includes("/admin/upload")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Upload Excel
                </Button>
              </NavLink>

              <NavLink to="/admin/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full px-4 text-sm ${
                    location.pathname.includes("/admin/users")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Manage Users
                </Button>
              </NavLink>

              <NavLink to="/admin/signature">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full px-4 text-sm ${
                    location.pathname.includes("/admin/signature")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Upload Signature
                </Button>
              </NavLink>
            </div>

            {/* Nested Routes */}
            <div className="pt-2">
              <Routes>
                <Route path="upload" element={<UploadExcel />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="signature" element={<SignatureUpload />} />
              </Routes>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
