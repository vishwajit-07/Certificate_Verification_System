import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ResetPassword() {
    const { token } = useParams();
    const nav = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (password.length < 6)
            return toast.error("Password must be at least 6 characters");

        if (password !== confirmPassword)
            return toast.error("Passwords do not match");

        try {
            setLoading(true);
            await api.post(`/auth/reset_pass/${token}`, { password });
            toast.success("Password reset successful");
            nav("/login");
        } catch {
            toast.error("Invalid or expired link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Card className="w-full max-w-md bg-white shadow-xl p-6">
                <CardContent>
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                        Reset Password
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
