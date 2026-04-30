"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { Camera, Navigation, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Marekebisho ya icons za Leaflet zisipotee
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

// 1. Custom Icon ya Mpiga Picha (Emerald Green)
const createPhotographerIcon = () => {
  const iconHtml = renderToString(
    <div className="bg-emerald-500 p-2.5 rounded-full border-2 border-white shadow-lg text-white ring-4 ring-emerald-500/20">
      <Camera size={18} />
    </div>
  );
  return L.divIcon({ html: iconHtml, className: "custom-icon", iconSize: [44, 44], iconAnchor: [22, 22] });
};

// 2. Custom Icon ya Mteja (Blue Navigation)
const createClientIcon = () => {
  const iconHtml = renderToString(
    <div className="bg-blue-600 p-2.5 rounded-full border-2 border-white shadow-lg text-white ring-4 ring-blue-500/20">
      <Navigation size={16} fill="white" />
    </div>
  );
  return L.divIcon({ html: iconHtml, className: "client-icon", iconSize: [44, 44], iconAnchor: [22, 22] });
};

// Component ya ku-control Map (Zoom & Pan)
function MapController({ userLocation, matchedPro }: { userLocation: any; matchedPro: any }) {
  const map = useMap();
  useEffect(() => {
    if (matchedPro && userLocation) {
      // Kama wamepatikana wote, zoom out kidogo ili wote waonekane
      const bounds = L.latLngBounds([userLocation.lat, userLocation.lng], [matchedPro.lat, matchedPro.lng]);
      map.fitBounds(bounds, { padding: [100, 100], animate: true });
    } else if (userLocation) {
      // Kama ni mteja tu, center kwake
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
    }
  }, [userLocation, matchedPro, map]);
  return null;
}

// Component ya kuchora barabara (Routing)
function RoadRoute({ start, end }: { start: any; end: any }) {
  const [points, setPoints] = useState<[number, number][]>([]);
  useEffect(() => {
    if (!start || !end) return;
    const getRoute = async () => {
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes?.[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
          setPoints(coords);
        }
      } catch (err) { console.error("OSRM Error:", err); }
    };
    getRoute();
  }, [start, end]);

  return points.length > 0 ? (
    <Polyline positions={points} pathOptions={{ color: '#10B981', weight: 6, opacity: 0.7, lineCap: 'round', dashArray: '2, 10' }} />
  ) : null;
}

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
  matchedPro?: any;
  status?: string;
}

export default function Map({ userLocation, matchedPro, status }: MapProps) {
  const [icons, setIcons] = useState<any>({ pro: null, client: null });
  const center = userLocation || { lat: -6.7924, lng: 39.2083 };

  useEffect(() => {
    setIcons({ pro: createPhotographerIcon(), client: createClientIcon() });
  }, []);

  if (!icons.client) return null;

  return (
    <div className="h-full w-full relative group">
      <MapContainer center={[center.lat, center.lng]} zoom={13} zoomControl={false} className="h-full w-full z-0">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        
        <MapController userLocation={userLocation} matchedPro={matchedPro} />

        {/* Marker ya Mteja */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.client}>
              <Popup>Uko hapa</Popup>
            </Marker>
            
            {/* Radar effect wakati anatafuta */}
            {status === 'searching' && (
              <Circle 
                center={[userLocation.lat, userLocation.lng]} 
                radius={800} 
                pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.1, color: '#3b82f6', weight: 1 }} 
              />
            )}
          </>
        )}

        {/* Marker ya Mpiga Picha & Njia ya Barabara */}
        {matchedPro && (
          <>
            <Marker position={[matchedPro.lat, matchedPro.lng]} icon={icons.pro}>
              <Popup>{matchedPro.name} anakuja</Popup>
            </Marker>
            <RoadRoute start={userLocation} end={matchedPro} />
          </>
        )}
      </MapContainer>

      {/* Status HUD mteja akiona map */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000]">
        {status === 'searching' && (
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-blue-100 flex items-center gap-3">
            <Loader2 size={18} className="text-blue-600 animate-spin" />
            <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Scanning Dar es Salaam...</span>
          </div>
        )}
      </div>
    </div>
  );
}