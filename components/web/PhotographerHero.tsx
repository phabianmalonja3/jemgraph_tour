"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { 
  Power, Activity, Star, CheckCircle, 
  Loader2, Navigation, Bell, MapPin, 
  Clock, Wallet, ShieldCheck, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamic Import ya MiniMap kuzuia SSR Errors (Next.js)
const MiniMap = dynamic(() => import('@/components/web/MiniMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900/50 animate-pulse flex items-center justify-center">
      <span className="text-[10px] text-emerald-500/40 font-black tracking-[0.2em] animate-pulse">
        CALIBRATING GPS...
      </span>
    </div>
  )
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v0.1';

// Logic ya Umbali
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

export default function PhotographerDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [myLocation, setMyLocation] = useState<{lat: number, lng: number} | null>(null);
  const stompClient = useRef<Client | null>(null);

  // Geo-location Tracking
  useEffect(() => {
    let watchId: number;
    if (isOnline) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => toast.error("GPS Error: " + err.message),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [isOnline]);

  // WebSocket Connection
  useEffect(() => {
    if (isOnline) {
      const socket = new SockJS(`${BASE_URL}/ws-jemigraph`);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          client.subscribe('/topic/nearby-jobs', (message) => {
            const raw = JSON.parse(message.body);
            setJobs(prev => [{
              id: raw.bookingId,
              title: raw.packageType || "Photo Session",
              location: raw.location || "Dar es Salaam",
              price: raw.price || 0,
              status: 'pending',
              lat: raw.lat,
              lng: raw.lng,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              client: { name: raw.clientName, rating: 4.9 },
            }, ...prev]);
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => null);
            toast.info("Mpya! Kazi imepatikana karibu nawe.");
          });
        },
      });
      stompClient.current = client;
      client.activate();
    } else {
      stompClient.current?.deactivate();
      setJobs([]); 
    }
    return () => { stompClient.current?.deactivate(); };
  }, [isOnline]);

  const handleAccept = async (id: string) => {
    setIsAccepting(id);
    try {
      const res = await axios.post(`${BASE_URL}/jobs/accept`, {
        bookingId: id,
        lat: myLocation?.lat,
        lng: myLocation?.lng
      });

      if (res.data.status === "MATCHED") {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'accepted' } : j));
        toast.success("Kazi imekubaliwa! Mteja anakuona sasa.");
      }
    } catch (err) {
      toast.error("Kazi hii imeshachukuliwa.");
      setJobs(prev => prev.filter(j => j.id !== id));
    } finally {
      setIsAccepting(null);
    }
  };

  return (
    /* MAIN CONTAINER: Imebadilishwa Background hapa */
    <main className="min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden font-sans">
      
      {/* AMBIENT BACKGROUND GLOWS (Hizi ndizo zinaleta utajiri wa rangi) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[130px] pointer-events-none opacity-60" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto p-5 space-y-6 pb-32">
        
        {/* TOP NAVBAR AREA */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Activity size={18} className={isOnline ? "text-emerald-500 animate-pulse" : "text-white/20"} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">System Status</p>
              <p className={cn("text-xs font-black uppercase", isOnline ? "text-emerald-500" : "text-rose-500")}>
                {isOnline ? "Active & Syncing" : "Offline"}
              </p>
            </div>
          </div>
          <div className="bg-white/5 p-2 px-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-end">
             <p className="text-[8px] font-black text-white/30 uppercase">Signal Strength</p>
             <p className="text-[10px] font-black text-white italic flex items-center gap-1">
               <Zap size={10} className="text-amber-500" /> STABLE
             </p>
          </div>
        </div>

        {/* RADAR TOGGLE BUTTON */}
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOnline(!isOnline)}
          className={cn(
            "w-full p-10 rounded-[3.5rem] border transition-all duration-700 flex flex-col items-center gap-4 relative overflow-hidden",
            isOnline 
              ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.1)]" 
              : "bg-slate-900/40 border-white/5 shadow-2xl backdrop-blur-xl"
          )}
        >
          <AnimatePresence>
            {isOnline && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)] animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={cn(
            "p-6 rounded-full z-10 transition-all duration-700 relative",
            isOnline ? "bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)] scale-110" : "bg-slate-800 border border-white/10"
          )}>
            <Power size={36} className={cn("transition-colors", isOnline ? "text-white" : "text-white/10")} />
          </div>

          <div className="text-center z-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
              {isOnline ? "RADAR ACTIVE" : "GO ONLINE"}
            </h2>
            <div className="flex items-center gap-2 justify-center mt-1">
               <div className={cn("w-1.5 h-1.5 rounded-full animate-ping", isOnline ? "bg-emerald-500" : "bg-rose-500")} />
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                 {isOnline ? "Scanning for nearby clients" : "Touch to receive orders"}
               </p>
            </div>
          </div>
        </motion.button>

        {/* JOBS SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-emerald-500" />
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Nearby Requests</h3>
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {jobs.length} FOUND
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {jobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.01]"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <Navigation size={24} className="text-white/10 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white/20 uppercase tracking-widest">Searching Zone...</p>
                  <p className="text-[9px] text-white/10 font-bold uppercase tracking-tight">Keep the app open for instant alerts</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => {
                  const distance = myLocation ? calculateDistance(myLocation.lat, myLocation.lng, job.lat, job.lng) : null;
                  return (
                    <motion.div 
                      key={job.id} layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      {/* MINI MAP AREA */}
                      <div className="h-40 relative bg-slate-950">
                        <MiniMap 
                          clientLat={job.lat} clientLng={job.lng} 
                          proLat={myLocation?.lat} proLng={myLocation?.lng} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                          <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                            <Navigation size={10} fill="currentColor" /> {distance || "--"} KM
                          </div>
                          <div className="bg-slate-950/80 backdrop-blur-md text-white/60 px-3 py-1 rounded-full text-[9px] font-black border border-white/10 flex items-center gap-1.5">
                            <Clock size={10} /> {job.time}
                          </div>
                        </div>
                      </div>

                      {/* JOB DETAILS */}
                      <div className="p-6 pt-2 space-y-5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center font-black text-emerald-500 border border-emerald-500/20 text-xl shadow-inner backdrop-blur-md">
                              {job.client.name.charAt(0)}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-black text-lg text-white uppercase tracking-tight leading-none">{job.title}</h4>
                              <div className="flex items-center gap-2">
                                 <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                   <Star size={10} fill="currentColor" /> {job.client.rating}
                                 </div>
                                 <span className="text-[10px] font-bold text-white/30 uppercase flex items-center gap-1">
                                   <MapPin size={10} /> {job.location}
                                 </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                                <Wallet size={10} /> PAY
                             </p>
                             <p className="text-xl font-black text-white italic tracking-tighter mt-1">
                               {job.price.toLocaleString()}<span className="text-xs ml-0.5 not-italic opacity-40">/=</span>
                             </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2 relative z-10">
                          {job.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => setJobs(prev => prev.filter(j => j.id !== job.id))}
                                className="px-6 py-4 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-white/30 hover:text-rose-500"
                              >
                                Skip
                              </button>
                              <button 
                                onClick={() => handleAccept(job.id)}
                                disabled={isAccepting === job.id}
                                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-slate-950"
                              >
                                {isAccepting === job.id ? <Loader2 className="animate-spin" size={16}/> : "Accept Job"}
                              </button>
                            </>
                          ) : (
                            <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">
                              <ShieldCheck size={18} /> CONFIRMED
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}