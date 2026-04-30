// @/components/dashboard/AdminHero.tsx
"use client";
import { cn } from '@/lib/utils';

import { BarChart3, Users, Wallet, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';

export function AdminHero() {
  return (
    <main className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter">SYSTEM OVERVIEW</h1>
        <p className="text-slate-500 text-sm">Welcome back, Super Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "TZS 4.2M", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        //   { label: "Active Shoots", value: "24", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "New Photographers", value: "+12", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Pending Approvals", value: "5", icon: ShieldCheck, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Hapa unaweza kuweka Chati au Table ya Recent Bookings */}
      <div className="bg-slate-900 rounded-[3rem] p-8 text-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black italic">RECENT TRANSACTIONS</h2>
          <button className="text-[10px] font-black bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all uppercase">View All</button>
        </div>
        <div className="space-y-4">
          {/* Table placeholder */}
          <div className="flex items-center justify-between py-4 border-b border-white/5">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-white/5 rounded-full border border-white/10" />
               <div>
                 <p className="font-bold text-sm">Hillary K.</p>
                 <p className="text-[10px] text-white/40 italic">Wedding Session • Dar es Salaam</p>
               </div>
             </div>
             <p className="font-black text-emerald-400">+ 150,000</p>
          </div>
        </div>
      </div>
    </main>
  );
}