"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { fetchMultiCampusPathways, addPathway } from "@/actions/pathwayActions";
import { toast } from "react-toastify";
import {
  MapPin,
  Route,
  ArrowRight,
  Plus,
  X,
  Tag,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Loader2,
  Layers,
  Sparkles,
  Info,
  Footprints,
  RotateCcw,
} from "lucide-react";

const ROUTE_COLORS = ["#38bdf8", "#10b981", "#a855f7", "#f59e0b"];

const createNodeIcon = (state = "idle") => {
  const isOrigin = state === "origin";
  const isTarget = state === "target";

  const glowColor = isOrigin
    ? "%2338bdf8"
    : isTarget
      ? "%2310b981"
      : "%2332c3a6";
  const strokeColor = isOrigin
    ? "%2338bdf8"
    : isTarget
      ? "%2310b981"
      : "%23475569";
  const coreFill = isOrigin
    ? "%2338bdf8"
    : isTarget
      ? "%2310b981"
      : "%2394a3b8";
  const baseBg = "%230b1329";
  const isSelected = isOrigin || isTarget;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" width="38" height="38">
      <defs>
        <filter id="pathway-node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="${isSelected ? "4" : "2"}" flood-color="${glowColor}" flood-opacity="${isSelected ? "0.95" : "0.5"}"/>
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="%23000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      ${isSelected ? `<circle cx="19" cy="19" r="17" fill="${glowColor}" fill-opacity="0.25"/>` : ""}
      <circle cx="19" cy="19" r="12" fill="${baseBg}" stroke="${strokeColor}" stroke-width="${isSelected ? "2.5" : "2"}" filter="url(%23pathway-node-glow)"/>
      <circle cx="19" cy="19" r="${isSelected ? "5" : "3.5"}" fill="${coreFill}"/>
    </svg>
  `.trim();

  return L.icon({
    iconUrl: `data:image/svg+xml;utf-8,${svg}`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
};

export default function NewPathwayMap({
  campus,
  locations = [],
  pathways = [],
}) {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loc1, setLoc1] = useState(null);
  const [loc2, setLoc2] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [cautions, setCautions] = useState([]);
  const [cautionInput, setCautionInput] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setRoutes([]);
    setSelectedRouteId(null);
    setError(null);

    async function getRoutes() {
      setIsLoading(true);
      setError(null);
      try {
        const paths = await fetchMultiCampusPathways(
          [loc1.lat, loc1.lng],
          [loc2.lat, loc2.lng],
          50,
        );

        if (active) {
          setRoutes(paths ?? []);
          setSelectedRouteId(paths?.[0]?.id || null);
        }
      } catch (err) {
        if (active)
          setError(err.message || "Failed to resolve pathway geometry");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    if (loc1 && loc2) {
      if (loc1.id === loc2.id) {
        setError("Origin and target nodes must be distinct.");
      } else {
        getRoutes();
      }
    }

    return () => {
      active = false;
    };
  }, [loc1, loc2]);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleAddTag = (e) => {
    e?.preventDefault();
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    setTags((prev) => [...prev, { id: crypto.randomUUID(), tag: trimmed }]);
    setTagInput("");
  };

  const handleAddCaution = (e) => {
    e?.preventDefault();
    const trimmed = cautionInput.trim();
    if (!trimmed) return;
    setCautions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), caution: trimmed },
    ]);
    setCautionInput("");
  };

  const removeTag = (id) => {
    setTags((prev) => prev.filter((item) => item.id !== id));
  };

  const removeCaution = (id) => {
    setCautions((prev) => prev.filter((item) => item.id !== id));
  };

  const resetSelection = () => {
    setLoc1(null);
    setLoc2(null);
    setRoutes([]);
    setSelectedRouteId(null);
    setError(null);
  };

  const onConfirm = async () => {
    if (isSaving) return;

    if (!loc1 || !loc2 || loc1.id === loc2.id) {
      toast.error("Please pick two distinct location nodes.");
      return;
    }

    const selectedRoute = routes.find((r) => r.id === selectedRouteId);
    if (!selectedRoute) {
      toast.error("Select an active pathway trajectory.");
      return;
    }

    const payload = {
      campus_id: campus.id,
      location1_id: loc1.id,
      location2_id: loc2.id,
      distance_m: selectedRoute.distance_m,
      is_blocked: false,
      tagsArray: tags.map((t) => t.tag),
      cautionsArray: cautions.map((c) => c.caution),
      description: description.trim(),
      coordinates: selectedRoute.coordinates,
    };

    try {
      setIsSaving(true);
      const result = await addPathway(payload);

      if (!result?.success) {
        toast.error(result?.error || "Failed to commit pathway.");
        return;
      }

      toast.success("Pathway successfully added to network!");
      resetSelection();
      setTags([]);
      setCautions([]);
      setDescription("");
    } catch (err) {
      toast.error(err.message || "Failed to commit pathway.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="order-2 flex flex-col rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md lg:order-1 lg:col-span-4 lg:max-h-[760px] lg:overflow-y-auto">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Route className="h-3.5 w-3.5" />
              <span>Route Trajectory</span>
            </div>
            {(loc1 || loc2) && (
              <button
                type="button"
                onClick={resetSelection}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
          <h2 className="mt-1 text-base font-bold text-foreground">
            Pathway Calibration
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Anchor endpoints to synthesize accessible graph routes.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <div
            className={`rounded-xl border p-3 transition-all ${
              loc1
                ? "border-primary/50 bg-primary/10"
                : "border-border/80 bg-secondary/30"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-primary">
                <MapPin className="h-3.5 w-3.5" /> Origin Anchor (A)
              </span>
              <span className="text-[10px] uppercase font-mono text-muted-foreground">
                {loc1 ? "Locked" : "Select Node"}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground truncate">
                {loc1 ? loc1.name : "Click an anchor node on map"}
              </span>
              {loc1 && (
                <button
                  type="button"
                  onClick={() => setLoc1(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl border p-3 transition-all ${
              loc2
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-border/80 bg-secondary/30"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-500">
                <MapPin className="h-3.5 w-3.5" /> Target Anchor (B)
              </span>
              <span className="text-[10px] uppercase font-mono text-muted-foreground">
                {loc2 ? "Locked" : "Select Node"}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground truncate">
                {loc2 ? loc2.name : "Click an anchor node on map"}
              </span>
              {loc2 && (
                <button
                  type="button"
                  onClick={() => setLoc2(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            <span>Calculating geometric profiles and multi-modal snaps...</span>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {routes.length > 0 && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Resolved Geometry Paths ({routes.length})</span>
            </label>
            <div className="mt-2 flex flex-col gap-2">
              {routes.map((route, idx) => {
                const isSelected = route.id === selectedRouteId;
                const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border/70 bg-card/40 hover:border-border hover:bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          Option {idx + 1} {idx === 0 && "(Optimal)"}
                        </span>
                        <div className="text-[10px] text-muted-foreground">
                          {route.coordinates?.length ?? 0} coordinate vertices
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {route.distance_m}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <span>Classification Tags</span>
            </label>
            <div className="mt-1.5 flex gap-1.5">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="e.g. Pedestrian, Wheelchair, Paved"
                className="h-9 flex-1 rounded-xl border border-border/80 bg-secondary/40 px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-background focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground"
                  >
                    <span>{t.tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Navigation Cautions</span>
            </label>
            <div className="mt-1.5 flex gap-1.5">
              <input
                type="text"
                value={cautionInput}
                onChange={(e) => setCautionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCaution();
                  }
                }}
                placeholder="e.g. Steep slope, Low lighting"
                className="h-9 flex-1 rounded-xl border border-border/80 bg-secondary/40 px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-background focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCaution}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {cautions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cautions.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-400"
                  >
                    <span>{c.caution}</span>
                    <button
                      type="button"
                      onClick={() => removeCaution(c.id)}
                      className="text-amber-400/80 hover:text-amber-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>Segment Description</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Structural condition, gate access, surface type..."
              className="mt-1.5 w-full rounded-xl border border-border/80 bg-secondary/40 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-background focus:outline-hidden"
            />
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-border/50">
          <button
            type="button"
            disabled={
              isSaving || isLoading || !selectedRouteId || !loc1 || !loc2
            }
            onClick={onConfirm}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Committing Pathway to Network...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Commit Pathway Segment</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
          <div className="pointer-events-none absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs">
              <Footprints className="h-3.5 w-3.5 text-primary" />
              <span>Click Nodes to Anchor Trajectory</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md shadow-xs">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{pathways?.length ?? 0} Committed Segments</span>
            </div>
          </div>

          <div className="relative h-[620px] w-full lg:h-[760px]">
            <MapContainer
              center={[campus.lat, campus.lng]}
              zoom={16}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              {pathways?.map((pathway) => (
                <Polyline
                  key={pathway.id}
                  positions={pathway.coordinates}
                  pathOptions={{
                    color: pathway.is_blocked ? "#ef4444" : "#64748b",
                    weight: 3.5,
                    opacity: 0.35,
                    dashArray: pathway.is_blocked ? "4, 6" : null,
                  }}
                />
              ))}

              {routes.map((route, idx) => {
                const isSelected = route.id === selectedRouteId;
                const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];

                return (
                  <Polyline
                    key={route.id}
                    positions={route.coordinates}
                    eventHandlers={{
                      click: () => setSelectedRouteId(route.id),
                    }}
                    pathOptions={{
                      color: isSelected ? color : "#94a3b8",
                      weight: isSelected ? 6.5 : 3.5,
                      opacity: isSelected ? 1.0 : 0.4,
                      dashArray: isSelected ? null : "4, 6",
                    }}
                  >
                    {isSelected && (
                      <Popup className="agentica-custom-popup">
                        <div className="rounded-xl border border-primary/40 bg-card p-3 text-foreground shadow-2xl backdrop-blur-xl">
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                            <Sparkles className="h-3 w-3" />
                            <span>Active Route Candidate</span>
                          </div>
                          <div className="mt-1 text-xs font-bold text-foreground">
                            Trajectory Option {idx + 1}
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                            Calculated distance: {route.distance_m}m
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Polyline>
                );
              })}

              {locations?.map((location) => {
                let pinState = "idle";
                if (loc1?.id === location.id) pinState = "origin";
                else if (loc2?.id === location.id) pinState = "target";

                return (
                  <Marker
                    key={location.id}
                    position={[
                      parseFloat(location.lat),
                      parseFloat(location.lng),
                    ]}
                    icon={createNodeIcon(pinState)}
                  >
                    <Popup className="agentica-custom-popup">
                      <div className="w-56 rounded-xl border border-border/80 bg-card p-3.5 text-foreground shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>Campus Node</span>
                        </div>
                        <h4 className="mt-1 text-xs font-bold text-foreground line-clamp-1">
                          {location.name}
                        </h4>
                        {location.description && (
                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                            {location.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-col gap-1.5 border-t border-border/50 pt-2.5">
                          <button
                            type="button"
                            onClick={() => setLoc1(location)}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                              loc1?.id === location.id
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "border border-border bg-secondary/50 text-foreground hover:bg-primary hover:text-primary-foreground"
                            }`}
                          >
                            <MapPin className="h-3 w-3" />
                            <span>
                              {loc1?.id === location.id
                                ? "Origin Selected"
                                : "Set as Origin (A)"}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLoc2(location)}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                              loc2?.id === location.id
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "border border-border bg-secondary/50 text-foreground hover:bg-emerald-600 hover:text-white"
                            }`}
                          >
                            <MapPin className="h-3 w-3" />
                            <span>
                              {loc2?.id === location.id
                                ? "Target Selected"
                                : "Set as Target (B)"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
