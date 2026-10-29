"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { ArrowUpRight, Building2, MapPin, Route } from "lucide-react";

const createAgenticaPin = () => {
  const primaryGlow = "%2332c3a6";   
  const primaryBorder = "%2338bdf8"; 
  const cardBg = "%230b1329";        

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="${primaryGlow}" flood-opacity="0.95"/>
          <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="%23000000" flood-opacity="0.7"/>
        </filter>
      </defs>
  
      <circle cx="20" cy="20" r="17" fill="${primaryGlow}" fill-opacity="0.18" />
      
  
      <circle cx="20" cy="20" r="13" fill="${cardBg}" stroke="${primaryBorder}" stroke-width="2.5" filter="url(%23neon-glow)"/>
      
  
      <g transform="translate(13, 12.5)" stroke="${primaryBorder}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M12 5.5c0 3.8-5 7.5-5 7.5S2 9.3 2 5.5a5 5 0 0 1 10 0z"/>
        <circle cx="7" cy="5.5" r="1.5" fill="${primaryBorder}"/>
      </g>
    </svg>
  `.trim();

  return L.icon({
    iconUrl: `data:image/svg+xml;utf-8,${svg}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
};

export default function AvailableCampusesMap({ campuses }) {
  const initialCenter = campuses.length > 0 
    ? [campuses[0].lat, campuses[0].lng] 
    : [20.5937, 78.9629];

  const initialZoom = campuses.length > 0 ? 6 : 5;

  return (
    <div className="relative h-[420px] w-full lg:h-[620px]">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {campuses.map((campus) => (
          <Marker
            key={campus.id}
            position={[parseFloat(campus.lat), parseFloat(campus.lng)]}
            icon={createAgenticaPin()}
          >
            <Popup className="agentica-custom-popup">
              <div className="w-64 rounded-xl border border-border/80 bg-card p-4 text-foreground shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold tracking-tight text-foreground line-clamp-1">
                    {campus.name}
                  </h3>
                </div>

                <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <p className="line-clamp-2 leading-relaxed">
                    {campus.address || "No precise address record"}
                  </p>
                </div>

                {campus.state && (
                  <div className="mt-2">
                    <span className="inline-flex rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {campus.state}
                    </span>
                  </div>
                )}

                <div className="mt-3.5 border-t border-border/50 pt-2.5">
                  <Link
                    href={`/campus/${campus.id}/network`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
                  >
                    <Route className="h-3.5 w-3.5" />
                    <span>Open Campus Network</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}