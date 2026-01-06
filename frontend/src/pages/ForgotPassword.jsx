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

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Enter your email");

        try {
            setLoading(true);
            const res = await api.post("/auth/forgot_password", { email });
            toast.success(res.message || "Reset link sent to email");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to send reset email"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white border border-gray-200 shadow-xl">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl text-gray-800">
                            Forgot Password
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            We will send a reset link to your email.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-sm text-gray-700">Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="bg-gray-50 border-gray-300 focus-visible:ring-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
