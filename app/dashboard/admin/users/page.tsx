"use client";

import { useState, useEffect } from "react";
import { 
  Users, UserPlus, Search, Shield, Trash2, Edit2, 
  RefreshCw, Eye, EyeOff, Lock, Mail, User as UserIcon,
  Filter, CheckCircle, XCircle, AlertCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";

// --- Types ---
type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PHOTOGRAPHER";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  joinedDate: string;
  avatar?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";

// Axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      // Optionally redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState<"ALL" | "ADMIN" | "PHOTOGRAPHER">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "PENDING" | "SUSPENDED">("ALL");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/users");
      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    const matchesStatus = filterStatus === "ALL" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (userData: Omit<User, "id" | "joinedDate"> & { password: string }) => {
    try {
      const response = await apiClient.post("/users", userData);
      setUsers([response.data, ...users]);
      toast.success("User created successfully!");
      return true;
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Failed to create user");
      return false;
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      setUsers(users.map(u => u.id === userId ? response.data : u));
      toast.success("User updated successfully!");
      return true;
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
      return false;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    toast.custom((t) => (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-rose-500 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-sm">Delete User?</h4>
            <p className="text-slate-500 text-xs mt-1">This action cannot be undone.</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={async () => {
                  try {
                    await apiClient.delete(`/users/${userId}`);
                    setUsers(users.filter(u => u.id !== userId));
                    toast.dismiss(t);
                    toast.success("User deleted successfully");
                  } catch (error: any) {
                    toast.dismiss(t);
                    toast.error(error.response?.data?.message || "Failed to delete user");
                  }
                }}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Delete
              </button>
              <button
                onClick={() => toast.dismiss(t)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await apiClient.patch(`/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus as any } : u
      ));
      toast.success(`User ${newStatus === "ACTIVE" ? "activated" : "suspended"} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Users className="text-emerald-600" size={24} />
            </div>
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor all system access accounts</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchUsers}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          
          <button 
            onClick={() => {
              setIsEditMode(false);
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <UserPlus size={18} />
            Add New User
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-8 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PHOTOGRAPHER">Photographer</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-8 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Total Users</p>
          <p className="text-2xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.status === "ACTIVE").length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600">{users.filter(u => u.status === "PENDING").length}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-emerald-600" size={24} />
                      <p className="text-slate-500 font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-500 font-medium">No users found</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center font-bold text-emerald-700">
                          {user.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold",
                        user.role === "ADMIN" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
                      )}>
                        <Shield size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold",
                        user.status === "ACTIVE" ? "text-emerald-600" : 
                        user.status === "PENDING" ? "text-amber-600" : "text-red-600"
                      )}>
                        {user.status === "ACTIVE" ? <CheckCircle size={14} /> :
                         user.status === "PENDING" ? <AlertCircle size={14} /> : <XCircle size={14} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                          title={user.status === "ACTIVE" ? "Suspend User" : "Activate User"}
                        >
                          {user.status === "ACTIVE" ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setIsEditMode(false);
        }} 
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        user={selectedUser}
        isEditMode={isEditMode}
      />
    </div>
  );
}

// --- User Modal Component ---
function UserModal({ isOpen, onClose, onCreateUser, onUpdateUser, user, isEditMode }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    role: user?.role || "PHOTOGRAPHER", 
    password: "" 
  });
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "PHOTOGRAPHER",
        password: ""
      });
    }
  }, [isOpen, user]);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0; i < 12; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password: retVal });
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let success = false;
    if (isEditMode && user) {
      const { password, ...updateData } = formData;
      success = await onUpdateUser(user.id, updateData);
    } else {
      success = await onCreateUser(formData);
    }
    
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  {isEditMode ? <Edit2 className="text-emerald-600" size={20} /> : <UserPlus className="text-emerald-600" size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {isEditMode ? "Edit User" : "Create Account"}
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isEditMode ? "Update user information" : "Add a new system user"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm"
                    placeholder="e.g. Hillary Kipimo"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                    placeholder="email@jemigraph.com"
                  />
                </div>
              </div>

              {/* Password - Only show in create mode */}
              {!isEditMode && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button 
                      type="button" 
                      onClick={generatePassword} 
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Generate
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-mono"
                      placeholder="••••••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">System Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {["PHOTOGRAPHER", "ADMIN"].map((r) => (
                    <button 
                      key={r} 
                      type="button" 
                      onClick={() => setFormData({...formData, role: r as any})}
                      className={cn(
                        "py-2.5 rounded-lg text-xs font-semibold transition-all border",
                        formData.role === r 
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isEditMode ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}