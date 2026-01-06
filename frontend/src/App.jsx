import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CertificateSearch from "./pages/CertificateSearch";
import CertificateView from "./pages/CertificateView";
import { api } from "./api";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.user) setUser(res.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <main>
        <Routes>
          <Route path="/" element={<CertificateSearch />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/admin/*" element={<AdminDashboard user={user} />} />
          <Route path="/cert/:certId" element={<CertificateView user={user} />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_pass/:token" element={<ResetPassword />} />
        </Routes>
      </main>
    </div>
  );
}
