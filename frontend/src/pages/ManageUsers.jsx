import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const studentsOnly = (res.users || []).filter(
        (user) => user.role === "student"
      );
      setUsers(studentsOnly);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };


  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) =>
    (u.name + u.email + u.role).toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    const res = await api.delete(`/admin/user/${userId}`);

    if (res.success) {
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="bg-white border border-gray-200 shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-gray-800">
            Manage Users
          </CardTitle>
          <CardDescription className="text-gray-500">
            View, filter and manage registered users.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 max-w-xs focus-visible:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-600">
                  <th className="p-3 font-medium">Sr.No</th>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 w-24 font-medium text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((u, i) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(u._id)}
                          className="text-xs h-8 px-3"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-400 text-sm"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
