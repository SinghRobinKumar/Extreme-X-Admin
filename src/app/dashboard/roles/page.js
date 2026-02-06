"use client";
import AdminLayout from "@/components/AdminLayout";
import useAdminStore from "@/store/useAdminStore";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function Roles() {
  const { token } = useAdminStore();
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });

  const availablePermissions = [
    { id: 'all', name: 'Full Access' },
    { id: 'manage_users', name: 'Manage Users' },
    { id: 'manage_roles', name: 'Manage Roles' },
    { id: 'manage_requests', name: 'Manage Requests' },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermissionChange = (permId) => {
    setFormData(prev => {
        const perms = prev.permissions.includes(permId)
            ? prev.permissions.filter(p => p !== permId)
            : [...prev.permissions, permId];
        return { ...prev, permissions: perms };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchRoles();
      setFormData({ name: '', description: '', permissions: [] });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create role');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
            <FiPlus /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
            <motion.div 
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
            >
                <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                <p className="text-gray-400 text-sm mb-4 h-10">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                            {perm}
                        </span>
                    ))}
                </div>
            </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 p-8 rounded-xl w-full max-w-md border border-gray-700"
            >
                <h2 className="text-2xl font-bold mb-6">Create New Role</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        placeholder="Role Name" 
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    <textarea 
                        placeholder="Description" 
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500 min-h-[100px]"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                    />
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Permissions</label>
                        <div className="space-y-2">
                            {availablePermissions.map(perm => (
                                <label key={perm.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-700/50">
                                    <input 
                                        type="checkbox"
                                        checked={formData.permissions.includes(perm.id)}
                                        onChange={() => handlePermissionChange(perm.id)}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                                    />
                                    <span className="text-sm">{perm.name}</span>
                                </label>
                            ))}
                        </div>
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
                            Create Role
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
