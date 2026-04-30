"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icons
const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const proIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component ya kusaidia Auto-Zoom (Fit Bounds)
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
  matchedPro: any;
}

export default function Map({ userLocation, matchedPro }: MapProps) {
  // Coordinates za mteja
  const clientPos: [number, number] | null = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : null;

  // Coordinates za mpiga picha (Simulated offset kwa sasa)
  const proPos: [number, number] | null = userLocation 
    ? [userLocation.lat + 0.005, userLocation.lng + 0.005] 
    : null;

  // Kutengeneza array ya points kwa ajili ya mstari
  const pathPoints: [number, number][] = (clientPos && proPos) ? [proPos, clientPos] : [];

  const center: [number, number] = clientPos || [-6.7924, 39.2083];

  return (
    <MapContainer center={center} zoom={15} className="h-full w-full" zoomControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      
      {/* Kuchora Mstari (Path) */}
      {pathPoints.length > 1 && (
        <Polyline 
          positions={pathPoints} 
          color="#3b82f6" // Blue color ya Tailwind
          weight={4}
          opacity={0.6}
          dashArray="10, 10" // Inatengeneza mstari wa kukatika-katika (dashed)
        />
      )}

      {/* Auto Zoom Logic */}
      {pathPoints.length > 1 && <FitBounds positions={pathPoints} />}

      {/* Mteja */}
      {clientPos && (
        <Marker position={clientPos} icon={clientIcon}>
          <Popup>Pickup Point</Popup>
        </Marker>
      )}

      {/* Mpiga Picha */}
      {proPos && (
        <Marker position={proPos} icon={proIcon}>
          <Popup>{matchedPro?.name} is on the way</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}