import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { api } from "../api";

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

export default function Register({ setUser }) {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (!name.trim()) e.name = "Name is required";

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email";
    }

    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Minimum 6 characters required";
    }

    if (!confirm) {
      e.confirm = "Confirm your password";
    } else if (confirm !== password) {
      e.confirm = "Passwords do not match";
    }

    return e;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const submit = async (e) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);

    if (Object.keys(v).length > 0) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (res.errors && Array.isArray(res.errors)) {
        toast.error(res.errors[0]?.msg || "Validation error");
        return;
      }

      if (res.user) {
        sessionStorage.setItem("user", JSON.stringify(res.user));
        if (setUser) setUser(res.user);

        toast.success(res.message || "User registered");

        if (res.user.role === "admin") nav("/admin");
        else nav("/");
      } else {
        toast.error(res.message || "Could not register");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border border-gray-200 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-lg font-bold text-white">
              VM
            </div>

            <CardTitle className="text-2xl text-gray-800">
              Create an account
            </CardTitle>

            <CardDescription className="text-gray-500">
              Register to access the certificate portal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Your full name"
                  className={`bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 text-sm ${
                    errors.name && touched.name
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="you@example.com"
                  className={`bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 text-sm ${
                    errors.email && touched.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </Label>
                <div
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-gray-50 ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Create a password"
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm" className="text-sm text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  autoComplete="new-password"
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => handleBlur("confirm")}
                  placeholder="Re-enter your password"
                  className={`bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 text-sm ${
                    errors.confirm && touched.confirm
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  }`}
                />
                {errors.confirm && touched.confirm && (
                  <p className="text-xs text-red-500">{errors.confirm}</p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-sm h-10"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating account...
                    </span>
                  ) : (
                    "Register"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
