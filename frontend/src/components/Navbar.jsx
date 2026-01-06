import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar({ user, setUser }) {
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}
    sessionStorage.clear();
    setUser(null);
    toast.success("Logged out successfully");
    nav("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-medium"
      : "text-gray-600";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              VM
            </div>
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              Certificate Portal
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm hover:text-blue-600 transition ${isActive(
                "/"
              )}`}
            >
              Certificate Search
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`text-sm hover:text-blue-600 transition ${isActive(
                  "/admin"
                )}`}
              >
                Admin
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`text-sm hover:text-blue-600 transition ${isActive(
                    "/login"
                  )}`}
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="text-sm h-9 px-4 text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="font-semibold text-gray-800">
                    {user.name || "User"}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logoutUser}
                  className="bg-red-600 text-white hover:bg-red-400"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-white border-gray-200 text-gray-700"
              >
                <div className="mt-6 space-y-4">
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className={`block text-sm hover:text-blue-600 ${isActive(
                      "/"
                    )}`}
                  >
                    Certificate Search
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className={`block text-sm hover:text-blue-600 ${isActive(
                        "/admin"
                      )}`}
                    >
                      Admin
                    </Link>
                  )}

                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className={`block text-sm hover:text-blue-600 ${isActive(
                          "/login"
                        )}`}
                      >
                        Login
                      </Link>

                      <Button
                        asChild
                        className="w-full text-sm mt-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Link
                          to="/register"
                          onClick={() => setOpen(false)}
                        >
                          Register
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="pt-3 border-t border-gray-200 space-y-3">
                      <p className="text-xs text-gray-500">
                        Signed in as{" "}
                        <span className="font-semibold text-gray-800">
                          {user.name || "User"}
                        </span>
                      </p>
                      <Button
                        variant="outline"
                        className="w-full bg-red-600  text-white hover:bg-red-400"
                        onClick={() => {
                          setOpen(false);
                          logoutUser();
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
