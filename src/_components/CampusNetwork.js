"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { 
  Building2, 
  MapPin, 
  Route, 
  ShieldAlert, 
  AlertTriangle, 
  Tag, 
  Info,
  Footprints,
  Compass
} from "lucide-react";

const ROUTE_PALETTE = [
  "#38bdf8",
  "#10b981",
  "#a855f7", 
  "#f59e0b", 
  "#06b6d4", 
  "#ec4899", 
];

const createNodeIcon = (isSelected = false) => {
  const primaryGlow = isSelected ? "%2338bdf8" : "%2332c3a6";
  const ringStroke = isSelected ? "%2338bdf8" : "%23475569";
  const coreFill = isSelected ? "%2338bdf8" : "%2394a3b8";
  const baseBg = "%230b1329";
  const glowOpacity = isSelected ? "1" : "0.5";
  const glowSpread = isSelected ? "4" : "2";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">
      <defs>
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="${glowSpread}" flood-color="${primaryGlow}" flood-opacity="${glowOpacity}"/>
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="%23000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      ${isSelected ? `<circle cx="18" cy="18" r="16" fill="${primaryGlow}" fill-opacity="0.25"/>` : ""}
      <circle cx="18" cy="18" r="11" fill="${baseBg}" stroke="${ringStroke}" stroke-width="${isSelected ? "2.5" : "2"}" filter="url(%23node-glow)"/>
      <circle cx="18" cy="18" r="${isSelected ? "4.5" : "3.5"}" fill="${coreFill}"/>
    </svg>
  `.trim();

  return L.icon({
    iconUrl: `data:image/svg+xml;utf-8,${svg}`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

function MapAutoCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function CampusNetwork({ 
  campus, 
  locations = [], 
  pathways = [],
  selectedLocationId,
  selectedPathwayId
}) {
  const mapCenter = [campus.lat, campus.lng];

  return (
    <div className="relative h-[560px] w-full lg:h-[720px]">
      <MapContainer
        center={mapCenter}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapAutoCenter center={mapCenter} />

        {pathways?.map((pathway, idx) => {
          const isSelected = selectedPathwayId === pathway.id;
          const routeColor = pathway.is_blocked
            ? "#ef4444"
            : ROUTE_PALETTE[idx % ROUTE_PALETTE.length];

          return (
            <Polyline
              key={pathway.id}
              positions={pathway.coordinates}
              pathOptions={{
                color: routeColor,
                weight: isSelected ? 7 : (pathway.is_blocked ? 4 : 5),
                opacity: isSelected ? 1.0 : (pathway.is_blocked ? 0.8 : 0.85),
                dashArray: pathway.is_blocked ? "6, 8" : null,
              }}
            >
              <Popup className="agentica-custom-popup">
                <div className="w-68 rounded-xl border border-border/80 bg-card p-4 text-foreground shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        pathway.is_blocked 
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : "border-primary/20 bg-primary/10 text-primary"
                      }`}>
                        {pathway.is_blocked ? (
                          <ShieldAlert className="h-4 w-4" />
                        ) : (
                          <Route className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-tight text-foreground">
                          Pathway Segment
                        </h4>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          #{pathway.id.toString().slice(-6)}
                        </span>
                      </div>
                    </div>

                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      pathway.is_blocked
                        ? "bg-destructive/15 text-destructive"
                        : "bg-primary/15 text-primary"
                    }`}>
                      {pathway.is_blocked ? "Blocked" : "Clear"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Segment Length</span>
                    <span className="font-semibold text-foreground">
                      {pathway.distance_m ? `${pathway.distance_m} meters` : "Unmeasured"}
                    </span>
                  </div>

                  {pathway.description && (
                    <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                      {pathway.description}
                    </div>
                  )}

                  {pathway.tags && pathway.tags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Tag className="h-3 w-3 text-primary" />
                        <span>Profile Tags</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {pathway.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {pathway.cautions && pathway.cautions.length > 0 && (
                    <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Active Cautions</span>
                      </div>
                      <ul className="mt-1 space-y-1">
                        {pathway.cautions.map((caution, i) => (
                          <li key={i} className="text-[10px] text-destructive/90 leading-tight">
                            • {caution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {locations?.map((location) => {
          const isSelected = selectedLocationId === location.id;

          return (
            <Marker
              key={location.id}
              position={[parseFloat(location.lat), parseFloat(location.lng)]}
              icon={createNodeIcon(isSelected)}
            >
              <Popup className="agentica-custom-popup">
                <div className="w-60 rounded-xl border border-border/80 bg-card p-4 text-foreground shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-tight text-foreground line-clamp-1">
                        {location.name}
                      </h4>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        #{location.id.toString().slice(-4)}
                      </span>
                    </div>
                  </div>

                  {location.description && (
                    <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                      {location.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] font-mono text-muted-foreground">
                    <span>{Number(location.lat).toFixed(4)}°N</span>
                    <span>{Number(location.lng).toFixed(4)}°E</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}