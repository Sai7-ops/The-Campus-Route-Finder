"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Route, 
  PlusCircle, 
  Compass, 
  ArrowUpRight, 
  Loader2 
} from "lucide-react";

const AvailableCampusesMap = dynamic(
  () => import("@/_components/AvailableCampusesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] lg:h-[620px] w-full flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          Mounting Campus Geographic Layer...
        </p>
      </div>
    ),
  }
);

export default function AvailableCampusesMapWrapper({ campuses }) {
  if (!campuses || campuses.length === 0) {
    return (
      <div className="flex min-h-[460px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary/60 text-muted-foreground shadow-inner">
          <Building2 className="h-7 w-7 text-primary/80" />
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          Directory Empty
        </div>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          No Registered Campuses Found
        </h2>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          The spatial graph network has no campus nodes configured. Register the first campus to map pathways.
        </p>
        <Link
          href="/campus/new"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Register New Campus</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Directory Header Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Compass className="h-3.5 w-3.5" />
            <span>Active Vector Directory</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Campus Network Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Select a verified campus to explore building coordinates, pathways, and transit grids.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>{campuses.length} {campuses.length === 1 ? "Campus" : "Campuses"} Online</span>
          </div>
          <Link
            href="/campus/new"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Campus</span>
          </Link>
        </div>
      </div>

      {/* Responsive Grid: Card Directory Left, Map Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Scrollable Cards */}
        <div className="order-2 flex flex-col gap-3.5 lg:order-1 lg:col-span-5 lg:max-h-[620px] lg:overflow-y-auto lg:pr-1.5">
          {campuses.map((campus) => (
            <div
              key={campus.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/50 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {campus.name}
                    </h2>
                  </div>

                  <span className="inline-flex shrink-0 items-center rounded-md border border-border/80 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {campus.state || "Active"}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                  <span className="line-clamp-2 leading-relaxed">
                    {campus.address || `${campus.lat.toFixed(4)}, ${campus.lng.toFixed(4)}`}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                  <span>{campus.lat?.toFixed(3)}°N</span>
                  <span>•</span>
                  <span>{campus.lng?.toFixed(3)}°E</span>
                </div>

                <Link
                  href={`/campus/${campus.id}/network`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
                >
                  <Route className="h-3.5 w-3.5" />
                  <span>Network</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Sticky Interactive Map */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="relative sticky top-20 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl">
            <div className="pointer-events-none absolute top-3 left-3 z-[1000] inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span>Vector Node Radar</span>
            </div>

            <AvailableCampusesMap campuses={campuses} />
          </div>
        </div>
      </div>
    </div>
  );
}