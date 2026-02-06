"use client";
import useAdminStore from "@/store/useAdminStore";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAdminStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/admin/auth/login`,
        { email, password }
      );
      
      const { user, token } = response.data;
      login(user, token);
      router.push("/dashboard");
    } catch (err) {
        console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-primary-500">Admin Panel</h2>
        {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
