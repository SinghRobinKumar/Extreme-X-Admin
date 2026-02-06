"use client";
import useAdminStore from "@/store/useAdminStore";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiHome, FiLogOut, FiMenu, FiShield, FiUsers, FiX } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const { admin, logout, isAuthenticated } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Protected Route Check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const permissions = admin?.permissions || [];
  const hasAccess = (perm) => permissions.includes('all') || permissions.includes(perm);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard", access: "all" },
    { name: "Users", icon: <FiUsers />, path: "/dashboard/users", access: "manage_users" },
    { name: "Roles", icon: <FiShield />, path: "/dashboard/roles", access: "manage_roles" },
    { name: "Requests", icon: <FiMenu />, path: "/dashboard/requests", access: "manage_requests" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-gray-800 border-r border-gray-700 flex-shrink-0"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold text-primary-500">Extreme-X</h1>
              <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
            </div>
            
            <nav className="mt-6 px-4 space-y-2">
              {menuItems.map((item) => (
                (item.access === 'all' || hasAccess(item.access)) && (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.path 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}>
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                )
              ))}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                        {admin?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium">{admin?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{admin?.role}</p>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 md:hidden"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="flex items-center gap-4 ml-auto">
             <button
              onClick={() => { logout(); router.push("/login"); }}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
