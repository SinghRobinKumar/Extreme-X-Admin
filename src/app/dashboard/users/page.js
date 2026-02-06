"use client";
import AdminLayout from "@/components/AdminLayout";
import useAdminStore from "@/store/useAdminStore";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertTriangle, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";

export default function Users() {
  const { token } = useAdminStore();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', password: '', roleId: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const resetForm = () => {
    setFormData({ id: null, name: '', email: '', password: '', roleId: '' });
    setIsModalOpen(false);
  };

  const handleEdit = (user) => {
    setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // Don't populate password
        roleId: roles.find(r => r.name === user.role_name)?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userToDelete.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (formData.id) {
        // Update
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password
        
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${formData.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
            <FiPlus /> Add User
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        <table className="w-full text-left">
            <thead className="bg-gray-700/50">
                <tr>
                    <th className="p-4 text-gray-300 font-semibold">Name</th>
                    <th className="p-4 text-gray-300 font-semibold">Email</th>
                    <th className="p-4 text-gray-300 font-semibold">Role</th>
                    <th className="p-4 text-gray-300 font-semibold">Created At</th>
                    <th className="p-4 text-gray-300 font-semibold text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4 text-gray-400">{user.email}</td>
                        <td className="p-4">
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs uppercase font-bold border border-blue-500/20">
                                {user.role_name}
                            </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => handleEdit(user)}
                                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                    title="Edit User"
                                >
                                    <FiEdit2 />
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(user)}
                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                    title="Delete User"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 p-8 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl relative"
            >
                <button 
                    onClick={resetForm}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FiX size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input 
                            placeholder="John Doe" 
                            className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input 
                            type="email"
                            placeholder="john@example.com" 
                            className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Password {formData.id && <span className="text-gray-500 font-normal">(Leave empty to keep current)</span>}
                        </label>
                        <input 
                            type="password"
                            placeholder="••••••••" 
                            className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required={!formData.id}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <select 
                            className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                            value={formData.roleId}
                            onChange={e => setFormData({...formData, roleId: e.target.value})}
                            required
                        >
                            <option value="">Select a Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={resetForm}
                            className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : (formData.id ? 'Save Changes' : 'Create User')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 p-6 rounded-xl w-full max-w-sm border border-gray-700 shadow-2xl text-center"
            >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertTriangle className="text-red-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delete User?</h3>
                <p className="text-gray-400 mb-6">
                    Are you sure you want to delete <span className="text-white font-semibold">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 p-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                    >
                        Delete User
                    </button>
                </div>
            </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
