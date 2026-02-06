"use client";
import AdminLayout from "@/components/AdminLayout";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
            <h3 className="text-gray-400 mb-2">Total Users</h3>
            <p className="text-4xl font-bold">12</p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
            <h3 className="text-gray-400 mb-2">Pending Requests</h3>
            <p className="text-4xl font-bold text-yellow-500">5</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
            <h3 className="text-gray-400 mb-2">Active Roles</h3>
            <p className="text-4xl font-bold text-blue-500">3</p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
