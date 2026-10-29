"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Route, 
  ShieldAlert, 
  PlusCircle, 
  Layers, 
  Footprints, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Navigation2, 
  Compass, 
  Loader2 
} from "lucide-react";

const CampusNetwork = dynamic(() => import("@/_components/CampusNetwork"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] w-full flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md lg:h-[720px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Mounting Campus Network Layer...
      </p>
    </div>
  ),
});

export default function CampusNetworkWrapper({ locations, pathways, campus }) {
  const [activeTab, setActiveTab] = useState("locations");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedPathwayId, setSelectedPathwayId] = useState(null);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

  const locCount = locations?.length ?? 0;
  const pathCount = pathways?.length ?? 0;
  const blockedCount = pathways?.filter((p) => p.is_blocked).length ?? 0;

  const filteredPathways = showBlockedOnly
    ? pathways?.filter((p) => p.is_blocked)
    : pathways;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Indexed Nodes</span>
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {locCount}
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Routable Pathways</span>
            <Route className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {pathCount}
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Blocked Edges</span>
            <ShieldAlert className={`h-4 w-4 ${blockedCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <div className={`mt-2 text-2xl font-bold tracking-tight ${blockedCount > 0 ? "text-destructive" : "text-foreground"}`}>
            {blockedCount}
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Graph Health</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {locCount > 0 && pathCount > 0 ? "Optimal" : "Sparse"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="order-2 flex flex-col rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md lg:order-1 lg:col-span-4 lg:h-[720px]">
          <div className="border-b border-border/60 p-3">
            <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border/60 bg-secondary/50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("locations")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "locations"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Nodes ({locCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pathways")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "pathways"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Route className="h-3.5 w-3.5" />
                <span>Edges ({pathCount})</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "locations" ? (
              <div className="flex flex-col gap-2">
                {locCount === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-foreground">No Locations Added</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Register points of interest to anchor route graphs.
                    </p>
                    <Link
                      href={`/campus/${campus.id}/location/new`}
                      className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Add First Location</span>
                    </Link>
                  </div>
                ) : (
                  locations.map((loc) => {
                    const isSelected = selectedLocationId === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => setSelectedLocationId(loc.id)}
                        className={`group cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-border/70 bg-card/40 hover:border-border hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                              <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <h3 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary">
                              {loc.name}
                            </h3>
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            #{loc.id.toString().slice(-4)}
                          </span>
                        </div>
                        {loc.description && (
                          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                            {loc.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                          <span>{Number(loc.lat).toFixed(4)}°N</span>
                          <span>{Number(loc.lng).toFixed(4)}°E</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-[11px] text-muted-foreground">Displaying {filteredPathways?.length ?? 0}</span>
                  <button
                    type="button"
                    onClick={() => setShowBlockedOnly(!showBlockedOnly)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    {showBlockedOnly ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{showBlockedOnly ? "Show All" : "Blocked Only"}</span>
                  </button>
                </div>

                {pathCount === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground">
                      <Route className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-foreground">No Pathways Mapped</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Generate multi-mode vector tracks connecting indexed nodes.
                    </p>
                    <Link
                      href={`/campus/${campus.id}/network/new`}
                      className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Trace Pathway</span>
                    </Link>
                  </div>
                ) : (
                  filteredPathways.map((path) => {
                    const isSelected = selectedPathwayId === path.id;
                    return (
                      <div
                        key={path.id}
                        onClick={() => setSelectedPathwayId(path.id)}
                        className={`group cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-border/70 bg-card/40 hover:border-border hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                              path.is_blocked
                                ? "border-destructive/30 bg-destructive/10 text-destructive"
                                : "border-primary/20 bg-primary/10 text-primary"
                            }`}>
                              {path.is_blocked ? (
                                <ShieldAlert className="h-3.5 w-3.5" />
                              ) : (
                                <Route className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-xs font-semibold text-foreground line-clamp-1">
                                Pathway #{path.id.toString().slice(-6)}
                              </h3>
                              <p className="text-[10px] text-muted-foreground">
                                {path.distance_m ? `${path.distance_m}m track` : "Variable length"}
                              </p>
                            </div>
                          </div>

                          <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            path.is_blocked
                              ? "bg-destructive/15 text-destructive"
                              : "bg-primary/15 text-primary"
                          }`}>
                            {path.is_blocked ? "Blocked" : "Clear"}
                          </span>
                        </div>

                        {path.description && (
                          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                            {path.description}
                          </p>
                        )}

                        {path.tags && path.tags.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {path.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-md border border-border/80 bg-secondary/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-8">
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
            <div className="pointer-events-none absolute top-3 left-3 z-[1000] flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span>Active Network Canvas</span>
              </div>
            </div>

            <CampusNetwork
              campus={campus}
              locations={locations}
              pathways={filteredPathways}
              selectedLocationId={selectedLocationId}
              selectedPathwayId={selectedPathwayId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}