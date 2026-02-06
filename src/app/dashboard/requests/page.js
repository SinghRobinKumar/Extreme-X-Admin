"use client";
import AdminLayout from "@/components/AdminLayout";
import useAdminStore from "@/store/useAdminStore";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";

export default function Requests() {
  const { token } = useAdminStore();
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({ status: '', progress: 0 });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormData({ status: request.status, progress: request.progress || 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/requests/${selectedRequest.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Service Requests</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-700/50">
                <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((request) => (
                    <tr key={request.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                            <div>
                                <p className="font-medium">{request.user_name}</p>
                                <p className="text-xs text-gray-400">{request.user_email}</p>
                            </div>
                        </td>
                        <td className="p-4">
                            <p>{request.service_name}</p>
                            <p className="text-xs text-gray-400">{request.company_name}</p>
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold
                                ${request.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                                  request.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 
                                  request.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'}
                            `}>
                                {request.status.replace('_', ' ')}
                            </span>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-700 rounded-full h-1.5">
                                    <div 
                                        className="bg-primary-500 h-1.5 rounded-full" 
                                        style={{ width: `${request.progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400">{request.progress}%</span>
                            </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                            {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                            <button 
                                onClick={() => handleEdit(request)}
                                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <FiEdit2 />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 p-8 rounded-xl w-full max-w-md border border-gray-700"
            >
                <h2 className="text-2xl font-bold mb-6">Update Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select 
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Progress ({formData.progress}%)</label>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            value={formData.progress}
                            onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
