"use client";

import { useActionState, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import addLocation from "@/actions/locationActions";
import {
  MapPin,
  Crosshair,
  Building2,
  FileText,
  Navigation2,
  CheckCircle2,
  Loader2,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

const createStaticNodeIcon = () => {
  const primaryGlow = "%2332c3a6";
  const ringStroke = "%23475569";
  const coreFill = "%2394a3b8";
  const baseBg = "%230b1329";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <defs>
        <filter id="static-node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${primaryGlow}" flood-opacity="0.4"/>
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="%23000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <circle cx="16" cy="16" r="10" fill="${baseBg}" stroke="${ringStroke}" stroke-width="2" filter="url(%23static-node-glow)"/>
      <circle cx="16" cy="16" r="3" fill="${coreFill}"/>
    </svg>
  `.trim();

  return L.icon({
    iconUrl: `data:image/svg+xml;utf-8,${svg}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const createTargetPinIcon = () => {
  const glowColor = "%2338bdf8";
  const crosshairColor = "%2338bdf8";
  const baseBg = "%230b1329";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44">
      <defs>
        <filter id="target-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4.5" flood-color="${glowColor}" flood-opacity="1"/>
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="%23000000" flood-opacity="0.8"/>
        </filter>
      </defs>
      <circle cx="22" cy="22" r="19" fill="${glowColor}" fill-opacity="0.2"/>
      <circle cx="22" cy="22" r="13" fill="${baseBg}" stroke="${crosshairColor}" stroke-width="2.5" filter="url(%23target-glow)"/>
      <g stroke="${crosshairColor}" stroke-width="2.5" stroke-linecap="round">
        <line x1="22" y1="13" x2="22" y2="16"/>
        <line x1="22" y1="28" x2="22" y2="31"/>
        <line x1="13" y1="22" x2="16" y2="22"/>
        <line x1="28" y1="22" x2="31" y2="22"/>
      </g>
      <circle cx="22" cy="22" r="3" fill="${crosshairColor}"/>
    </svg>
  `.trim();

  return L.icon({
    iconUrl: `data:image/svg+xml;utf-8,${svg}`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

function ClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng);
    },
  });
  return null;
}

export default function NewLocationMap({ campus, locations }) {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const res = await addLocation(formData);
      if (res?.success) {
        setSelectedPosition(null);
      }
      return res;
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Spatial node registered successfully!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng);
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="order-2 flex flex-col rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md lg:order-1 lg:col-span-4 lg:h-[680px]">
        <div className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Navigation2 className="h-3.5 w-3.5" />
            <span>Node Parameters</span>
          </div>
          <h2 className="mt-1 text-base font-bold text-foreground">
            Metadata & Anchors
          </h2>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Specify attributes for graph identification and routing endpoint calculations.
          </p>
        </div>

        <div className="mt-4">
          <div
            className={`rounded-xl border p-3.5 transition-all ${
              selectedPosition
                ? "border-primary/50 bg-primary/10"
                : "border-dashed border-border/80 bg-secondary/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Crosshair
                  className={`h-3.5 w-3.5 ${
                    selectedPosition ? "text-primary animate-pulse" : "text-muted-foreground"
                  }`}
                />
                GPS Target Lock
              </span>
              <span
                className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  selectedPosition
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {selectedPosition ? "Calibrated" : "Required"}
              </span>
            </div>

            {selectedPosition ? (
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="rounded-lg border border-border/60 bg-card/60 p-2">
                  <div className="text-[10px] text-muted-foreground">LATITUDE</div>
                  <div className="font-semibold text-foreground">
                    {selectedPosition.lat.toFixed(6)}°
                  </div>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-2">
                  <div className="text-[10px] text-muted-foreground">LONGITUDE</div>
                  <div className="font-semibold text-foreground">
                    {selectedPosition.lng.toFixed(6)}°
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                Click anywhere on the interactive map to plant target coordinates.
              </p>
            )}
          </div>
        </div>

        <form action={formAction} className="mt-4 flex flex-1 flex-col justify-between">
          <input type="hidden" name="campusId" value={campus.id} />
          <input type="hidden" name="lat" value={selectedPosition?.lat ?? ""} />
          <input type="hidden" name="lng" value={selectedPosition?.lng ?? ""} />

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Node Designation</span>
                <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Central Library West Gate"
                className="mt-1.5 h-10 w-full rounded-xl border border-border/80 bg-secondary/40 px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>Navigational Description</span>
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Key structural features, floor/gate access, elevator proximity..."
                className="mt-1.5 w-full rounded-xl border border-border/80 bg-secondary/40 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-secondary/20 p-3 text-[11px] text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                Existing nodes render as secondary anchors to prevent duplicate marker registration.
              </span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-border/50">
            <button
              type="submit"
              disabled={isPending || !selectedPosition}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Committing Node to Graph...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Commit Geodetic Node</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
          <div className="pointer-events-none absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs">
              <Crosshair className="h-3.5 w-3.5 text-primary animate-spin [animation-duration:8s]" />
              <span>Click Map To Drop Pin</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md shadow-xs">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{locations?.length ?? 0} Mapped Points</span>
            </div>
          </div>

          <div className="relative h-[560px] w-full lg:h-[680px]">
            <MapContainer
              center={[campus.lat, campus.lng]}
              zoom={17}
              maxZoom={21}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={21}
                maxNativeZoom={19}
              />

              <ClickHandler onSelectLocation={handleMapClick} />

              {locations?.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={createStaticNodeIcon()}
                >
                  <Popup className="agentica-custom-popup">
                    <div className="w-56 rounded-xl border border-border/80 bg-card p-3 text-foreground shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>Existing Anchor</span>
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-foreground line-clamp-1">
                        {location.name}
                      </h4>
                      {location.description && (
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                          {location.description}
                        </p>
                      )}
                      <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                        {Number(location.lat).toFixed(4)}°, {Number(location.lng).toFixed(4)}°
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selectedPosition && (
                <Marker position={selectedPosition} icon={createTargetPinIcon()}>
                  <Popup className="agentica-custom-popup">
                    <div className="w-56 rounded-xl border border-primary/40 bg-card p-3 text-foreground shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="h-3 w-3" />
                        <span>Selected Target</span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-foreground font-semibold">
                        {selectedPosition.lat.toFixed(6)}°N, {selectedPosition.lng.toFixed(6)}°E
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Complete form fields to anchor this node.
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}