"use client";

import * as React from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, Camera, Loader2, MapPin, Clock, Navigation } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const LOCATIONIQ_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;

export default function Maps() {
  const [viewport, setViewport] = React.useState({
    longitude: 39.2083,
    latitude: -6.7924,
    zoom: 12
  });

  const [routeData, setRouteData] = React.useState(null);
  const [travelStats, setTravelStats] = React.useState({ distance: 0, duration: 0 });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState("Sogeza pin au tafuta eneo...");
  const [isLoading, setIsLoading] = React.useState(false);

  // --- 1. FUNCTION YA KU-CALCULATE ROUTE NA MUDA (ETA) ---
  const calculateRoute = React.useCallback(async (destLat: number, destLng: number) => {
    // Hapa tunachukua 'start' kama location ya sasa ya mpiga picha (au fixed point kwa sasa)
    // Kwenye project yako, chukua coordinates za Photographer kutoka REDIS
    const start = [39.2083, -6.7924]; 
    const end = [destLng, destLat];

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      const json = await query.json();
      
      if (json.routes && json.routes[0]) {
        const data = json.routes[0];
        setRouteData({
          type: 'Feature',
          geometry: data.geometry
        });
        // distance iko kwenye meters, duration iko kwenye seconds
        setTravelStats({
          distance: (data.distance / 1000).toFixed(1), // km
          duration: Math.floor(data.duration / 60) // minutes
        });
      }
    } catch (err) {
      console.error("Route calculation error:", err);
    }
  }, []);

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data.display_name) setSelectedAddress(data.display_name);
    } catch (err) {
      setSelectedAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  const onMarkerDragEnd = React.useCallback((event: any) => {
    const { lng, lat } = event.lngLat;
    setViewport(prev => ({ ...prev, longitude: lng, latitude: lat }));
    setIsLoading(true);
    
    // Piga zote mbili: Jina la eneo NA Njia ya kufika
    getAddressFromCoords(lat, lng);
    calculateRoute(lat, lng).finally(() => setIsLoading(false));
  }, [calculateRoute]);

  // Style ya ule mstari wa barabara
  const routeLayerStyle: any = {
    id: 'route-line',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': '#10b981', // Emerald 500
      'line-width': 5,
      'line-opacity': 0.75
    }
  };

  // ... (handleInputChange na onSelectLocation zibaki vile vile)
  const debouncedSearch = useDebouncedCallback(async (text: string) => {
    if (text.length > 3) {
      try {
        const res = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${text}&limit=5&countrycodes=tz`);
        const data = await res.json();
        if (Array.isArray(data)) setResults(data);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    } else { setResults([]); setIsLoading(false); }
  }, 800);

  const handleInputChange = (e: any) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 3) setIsLoading(true);
    debouncedSearch(e.target.value);
  };

  const onSelectLocation = (lat: string, lon: string, name: string) => {
    const l = parseFloat(lat);
    const n = parseFloat(lon);
    setViewport({ ...viewport, latitude: l, longitude: n, zoom: 15 });
    setSelectedAddress(name);
    calculateRoute(l, n);
    setResults([]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <div className="w-96 bg-white shadow-2xl z-20 p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-black text-slate-800 italic tracking-tighter">
            JEMI<span className="text-emerald-600">GRAPH</span>
        </h2>

        <div className="relative">
          <input type="text" className="w-full pl-10 pr-4 py-4 bg-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Tafuta eneo..." value={searchQuery} onChange={handleInputChange} />
          <div className="absolute left-3 top-4 text-slate-400">
            {isLoading ? <Loader2 size={18} className="animate-spin text-emerald-500" /> : <Search size={18} />}
          </div>
          {results.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl border z-50">
              {results.map((item: any) => (
                <button key={item.place_id} onClick={() => onSelectLocation(item.lat, item.lon, item.display_name)} className="w-full flex items-center gap-3 p-4 hover:bg-emerald-50 text-left border-b last:border-0">
                  <MapPin size={14} className="text-emerald-600" />
                  <span className="text-xs font-bold truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- STATS CARD: HAPA NDIPO MUDA NA UMBALI HUONEKANA --- */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 p-4 rounded-3xl text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase opacity-60">Muda (ETA)</span>
                </div>
                <p className="text-xl font-black">{travelStats.duration} <span className="text-sm font-normal">min</span></p>
            </div>
            <div className="bg-emerald-600 p-4 rounded-3xl text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Navigation size={14} className="text-emerald-200" />
                    <span className="text-[10px] font-bold uppercase opacity-60">Umbali</span>
                </div>
                <p className="text-xl font-black">{travelStats.distance} <span className="text-sm font-normal">km</span></p>
            </div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 italic">
          <p className="text-xs font-bold text-emerald-900">{selectedAddress}</p>
        </div>

        <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm mt-auto shadow-lg hover:bg-black transition-all">
            THIBITISHA NA ENDELEA
        </button>
      </div>

      <div className="flex-1 relative bg-slate-200">
       
      </div>
    </div>
  );
}