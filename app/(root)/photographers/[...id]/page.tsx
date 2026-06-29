// app/photographer/[id]/page.tsx
import { Suspense } from "react";
import PhotographerBookingClient from "./PhotographerBookingClient";

interface PageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function PhotographerBookingPage({ params }:PageProps) {
  const { id } = await params;

const [data, pkg] = await Promise.all([
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/photographers/${id}`, {
    cache: "no-store",
  }),
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`, {
    cache: "no-store",
  }),
]);
  const photographer = await data.json();
  const packageData = await pkg.json();




  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading photographer details...</p>
        </div>
      </div>
    }>

      <PhotographerBookingClient initialPhotographer={photographer} initialPackages={packageData} />


    </Suspense>
  );
}