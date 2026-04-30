// app/dashboard/page.tsx

"use client";
import { AdminHero } from "@/components/web/AdminHero";
import PhotographerDashboard from "@/components/web/PhotographerHero";
{}
import { useAuth } from "@/context/AuthContext";


export default function DashboardPage() {
  const { user, isAdmin, isPhotographer } = useAuth();

  console.log()

  // Logic ya ku-render Dashboard husika
  return (
    <div className="min-h-screen">
      {isAdmin ? (
        <AdminHero />
      ) : (
        <PhotographerDashboard />
      )}
    </div>
  );
}