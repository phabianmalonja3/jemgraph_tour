"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Camera,
  Image as ImageIcon,
  Phone,
  ChevronLeft,
  Navigation,
  Star,
  Clock,
  Loader2,
} from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/web/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold tracking-widest">
      INITIALIZING RADAR...
    </div>
  ),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";

const PACKAGES = [
  { id: "quick", name: "Quickie", icon: <Zap size={18} />, price: 15000, desc: "15m • 5 High-Res Photos" },
  { id: "std", name: "Standard", icon: <Camera size={18} />, price: 45000, desc: "1h • 20 High-Res Photos" },
  { id: "pro", name: "Premium", icon: <ImageIcon size={18} />, price: 90000, desc: "2h • All Raw + Edited" },
];

interface Location { lat: number; lng: number; }
interface Package { id: string; name?: string; icon: JSX.Element; price: number; desc: string; }
interface Pro { name: string; phone?: string; avatar?: string; }

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [matchedPro, setMatchedPro] = useState<Pro | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  // WebSocket for matching
  useEffect(() => {
    if (currentStep !== 3 || !bookingRef) return;

    const socket = new SockJS(`${BASE_URL}/ws-jemigraph`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/match/${bookingRef}`, (msg) => {
          const proData = JSON.parse(msg.body);
          setMatchedPro(proData);
          setCurrentStep(4);
          toast.success("Professional Found!");
        });
      },
    });

    client.activate();
    return () => { client.deactivate(); };
  }, [currentStep, bookingRef]);

  // Function ya kupata location bila "static" coordinates
  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("Browser yako haisupport GPS");
        reject("No Geolocation Support");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        (err) => {
          toast.error("Tafadhali washa GPS (Location) ili uweze kuomba mpiga picha");
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const startSearch = async () => {
    if (!form.name || !form.phone) {
      toast.error("Tafadhali jaza jina na namba ya simu");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Tunatafuta location kwanza, ikishindwa itaenda kwenye 'catch'
      const coords = await getCurrentLocation();
      
      const ref = `JG-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;
      setBookingRef(ref);

      await axios.post(`${BASE_URL}/jobs/request`, {
        bookingId: ref,
        clientName: form.name,
        clientPhone: form.phone,
        packageType: selectedPkg?.name,
        price: selectedPkg?.price,
        lat: coords.lat,
        lng: coords.lng,
      });

      setCurrentStep(3);
    } catch (error) {
      console.error("Booking Error:", error);
      // Kama ni kosa la mtandao na sio la GPS
      if (typeof error !== 'string') {
         toast.error("Imeshindwa kutuma maombi. Angalia internet yako.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER STEPS (Summary) ---
  const renderStep1 = () => (
    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 pt-16 h-full flex flex-col">
       <div className="mb-10">
         <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Jemigraph</h1>
         <p className="text-slate-400 font-medium">Piga picha kali, popote ulipo.</p>
       </div>
       <div className="space-y-4 flex-1">
         {PACKAGES.map((pkg) => (
           <motion.button 
             key={pkg.id}
             onClick={() => { setSelectedPkg(pkg); setCurrentStep(2); }}
             className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white border-2 border-slate-50 hover:border-blue-600 transition-all shadow-sm"
           >
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">{pkg.icon}</div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900">{pkg.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{pkg.desc}</p>
                </div>
             </div>
             <p className="font-black text-slate-900">TSh {pkg.price.toLocaleString()}</p>
           </motion.button>
         ))}
       </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="p-6 pt-16">
      <button onClick={() => setCurrentStep(1)} className="mb-8 p-3 bg-slate-100 rounded-2xl"><ChevronLeft size={24} /></button>
      <h2 className="text-3xl font-black mb-6">Taarifa zako</h2>
      <div className="space-y-4">
        <input 
          className="w-full p-6 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-2 ring-blue-500 font-bold" 
          placeholder="Jina lako kamili" 
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input 
          className="w-full p-6 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-2 ring-blue-500 font-bold" 
          placeholder="Namba ya simu (0...)" 
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button 
          onClick={startSearch} 
          disabled={isSubmitting}
          className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl flex items-center justify-center gap-3"
        >
          {isSubmitting ? <><Loader2 className="animate-spin" /> Inatafuta Location...</> : "Tafuta Mpiga Picha"}
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div key="step3" className="h-full flex flex-col items-center justify-center p-8 bg-white">
      <div className="relative w-48 h-48 mb-10">
        <motion.div animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-100 rounded-full" />
        <div className="relative z-10 bg-blue-600 p-10 rounded-full text-white flex items-center justify-center h-full w-full">
          <Navigation size={40} className="animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-black italic">Scanning Nearby Pros...</h2>
      <p className="text-slate-400 mt-2 font-medium">Usifunge ukurasa huu, tunakuunganisha na mpiga picha wa karibu.</p>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div key="step4" className="h-full flex flex-col">
       <div className="flex-1 relative">
         <MapWithNoSSR userLocation={userLocation} matchedPro={matchedPro} />
         <div className="absolute top-6 left-6 z-10 bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
           <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" /> Pro is on the way
         </div>
       </div>
       <div className="bg-white rounded-t-[3rem] p-8 shadow-2xl border-t z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                {matchedPro?.name?.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-black">{matchedPro?.name}</h4>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm"><Star size={14} fill="currentColor"/> 4.9 Verified</div>
              </div>
            </div>
            <a href={`tel:${matchedPro?.phone}`} className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200"><Phone /></a>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="bg-slate-50 p-4 rounded-2xl border">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Kufika</p>
               <p className="font-black flex items-center gap-2 italic"><Clock size={14} className="text-blue-600"/> 5 - 10 MIN</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Malipo (Kazi)</p>
               <p className="font-black italic">TSh {selectedPkg?.price.toLocaleString()}</p>
             </div>
          </div>
       </div>
    </motion.div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster position="top-center" richColors theme="light" />
      <main className="max-w-md mx-auto h-screen relative bg-white overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && matchedPro && renderStep4()}
        </AnimatePresence>
      </main>
    </div>
  );
}