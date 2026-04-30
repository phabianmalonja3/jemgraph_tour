"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

interface MiniMapProps {
  clientLat: number;
  clientLng: number;
  proLat?: number | null;
  proLng?: number | null;
}

export default function MiniMap({ clientLat, clientLng, proLat, proLng }: MiniMapProps) {
  const clientCoords: [number, number] = [clientLat, clientLng];
  const proCoords: [number, number] | null = proLat && proLng ? [proLat, proLng] : null;

  return (
    <MapContainer 
      center={clientCoords} 
      zoom={15} 
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      
      {/* Mteja Marker */}
      <Marker position={clientCoords} icon={markerIcon} />
      
      {/* Njia na Pro Marker */}
      {proCoords && (
        <>
          <Marker position={proCoords} icon={markerIcon} />
          <Polyline 
            positions={[proCoords, clientCoords]} 
            pathOptions={{ color: '#10b981', weight: 3, dashArray: '10, 10', opacity: 0.6 }} 
          />
          <RecenterMap coords={proCoords} />
        </>
      )}
    </MapContainer>
  );
}