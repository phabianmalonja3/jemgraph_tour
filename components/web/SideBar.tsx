"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera, User, Wallet, Settings, LogOut,
  LayoutDashboard, Shield, Users, FileText,
  ChevronLeft, ChevronRight, Briefcase, BarChart3
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

// --- Navigation Config ---
const CORE_LINKS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
];

const PHOTOGRAPHER_LINKS = [
  { icon: Camera, label: "Shoots", href: "/photographer/shoots" },
  { icon: Wallet, label: "Earnings", href: "/earnings" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
];

const ADMIN_LINKS = [
  { icon: Users, label: "Users", href: "/dashboard/admin/users" },
  { icon: Shield, label: "Verification", href: "/dashboard/admin/approvals" },
  { icon: FileText, label: "Vouchers", href: "/dashboard/admin/vouchers" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/stats" },
];

// --- Sub-Components ---
const SidebarItem = ({ icon: Icon, label, href, active, isCollapsed }: any) => (
  <Link href={href || "#"} className="relative group">
    <div className={cn(
      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 mb-0.5",
      active
        ? "bg-emerald-600 text-white shadow-sm"
        : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
    )}>
      <div className={cn("flex shrink-0 items-center justify-center", isCollapsed ? "w-full" : "")}>
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      </div>
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -5 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="font-medium text-xs whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
      {isCollapsed && (
        <div className="absolute left-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-left z-[100] bg-slate-800 text-white text-[9px] font-medium px-2 py-1 rounded pointer-events-none shadow-lg whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  </Link>
);

export function Sidebar({ isOnline }: { isOnline: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isPhotographer } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully", {
        description: "Redirecting...",
        duration: 1500,
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Get user initial for avatar
  const userInitial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "fixed top-6 z-[70] bg-white border border-slate-200 rounded-lg p-1 shadow-sm hover:shadow transition-all duration-300 lg:flex hidden items-center justify-center",
          isCollapsed ? "left-[52px]" : "left-[188px]"
        )}
      >
        {isCollapsed ? <ChevronRight size={14} className="text-emerald-600" /> : <ChevronLeft size={14} className="text-emerald-600" />}
      </button>

      {/* Sidebar Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 60 : 200 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[60] shadow-sm hidden lg:flex"
      >
        <div className="flex flex-col h-full p-2">
          
          {/* User Profile Info */}
          <div className={cn("mb-6 mt-3", isCollapsed ? "flex flex-col items-center" : "px-1")}>
            <div className="relative inline-block">
              {isPhotographer && isOnline && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                  transition={{ repeat: Infinity, duration: 2 }} 
                  className="absolute -inset-1 border border-emerald-400 rounded-full" 
                />
              )}
              <div className={cn(
                "rounded-xl overflow-hidden border border-white shadow-sm bg-emerald-50 flex items-center justify-center transition-all duration-300", 
                isCollapsed ? "w-9 h-9" : "w-10 h-10"
              )}>
                {isAdmin ? (
                  <Shield className="text-emerald-600 w-4 h-4" />
                ) : user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                ) : (
                  <span className="text-emerald-700 font-bold text-sm">{userInitial}</span>
                )}
              </div>
            </div>
            {!isCollapsed && (
              <div className="mt-2 text-center">
                <h2 className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{user.name?.split(' ')[0] || user.name}</h2>
                <span className="inline-block mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  {user.role === 'ADMIN' ? 'Admin' : 'Pro'}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-2 mx-1" />

          {/* Navigation Sections */}
          <nav className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            
            {/* Core Section */}
            <div>
              {!isCollapsed && (
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Menu</p>
              )}
              {CORE_LINKS.map(link => (
                <SidebarItem key={link.href} {...link} active={pathname === link.href} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Photographer Section */}
            {isPhotographer && (
              <div>
                {!isCollapsed && (
                  <p className="text-[8px] font-bold text-amber-500 uppercase tracking-wider mb-2 ml-1">Hub</p>
                )}
                {PHOTOGRAPHER_LINKS.map(link => (
                  <SidebarItem key={link.href} {...link} active={pathname === link.href} isCollapsed={isCollapsed} />
                ))}
              </div>
            )}

            {/* Admin Section */}
            {isAdmin && (
              <div>
                {!isCollapsed && (
                  <p className="text-[8px] font-bold text-rose-500 uppercase tracking-wider mb-2 ml-1">Admin</p>
                )}
                {ADMIN_LINKS.map(link => (
                  <SidebarItem key={link.href} {...link} active={pathname === link.href} isCollapsed={isCollapsed} />
                ))}
              </div>
            )}
          </nav>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-2 mx-1" />

          {/* Footer Actions */}
          <div className="space-y-0.5">
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
              href="/settings" 
              active={pathname === "/settings"} 
              isCollapsed={isCollapsed} 
            />
            
            <button 
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-all text-xs font-medium relative group", 
                isCollapsed && "justify-center"
              )}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Logout</span>}
              {isCollapsed && (
                <div className="absolute left-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-left z-[100] bg-rose-500 text-white text-[9px] font-medium px-2 py-1 rounded pointer-events-none shadow-lg whitespace-nowrap">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Spacer for Content */}
      <div className={cn("hidden lg:block transition-all duration-300", isCollapsed ? "ml-[60px]" : "ml-[200px]")} />
    </>
  );
}