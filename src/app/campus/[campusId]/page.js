import { supabase } from "@/_lib/supabaseClient";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Route, 
  ArrowLeft, 
  ArrowUpRight, 
  Fingerprint, 
  Globe2, 
  Compass, 
  Layers,
  MapPinned
} from "lucide-react";

export default async function CampusDetails({ params }) {
  const { campusId } = await params;
  const { data: campus, error } = await supabase
    .from("campuses")
    .select()
    .eq("id", campusId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch Campus details: ${error.message}`);
  }

  return (
    <div className="relative isolate flex-1">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/campus"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Directory</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Compass className="h-3 w-3" />
                <span>Verified Campus Node</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {campus.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Registered Geo-Fenced Academic Territory
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/campus/${campusId}/network`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 md:w-auto"
            >
              <Route className="h-4 w-4" />
              <span>Launch Campus Network</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/40 p-4.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Geographic Address</span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-foreground">
                {campus.address || "No formal street address recorded"}
              </p>
              {campus.state && (
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-md border border-border bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-foreground">
                    {campus.state}
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/40 p-4.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Globe2 className="h-3.5 w-3.5 text-primary" />
                <span>Center Coordinates</span>
              </div>
              <div className="mt-2.5 flex items-center gap-4 text-xs font-mono text-foreground">
                <div>
                  <span className="text-muted-foreground">LAT: </span>
                  {campus.lat ? Number(campus.lat).toFixed(6) : "N/A"}°
                </div>
                <div>
                  <span className="text-muted-foreground">LNG: </span>
                  {campus.lng ? Number(campus.lng).toFixed(6) : "N/A"}°
                </div>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Anchored base datum for internal route snapping
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/40 p-4.5 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Fingerprint className="h-3.5 w-3.5 text-primary" />
                <span>Node System Reference</span>
              </div>
              <p className="mt-2.5 font-mono text-[11px] text-muted-foreground break-all">
                {campus.id}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-primary">
                <Layers className="h-3 w-3" />
                <span>PostGIS Spatial Topology Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-4 sm:flex-row">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <MapPinned className="h-4 w-4 text-primary" />
              <span>Looking to map new pathways, buildings, or road blockages?</span>
            </div>
            <Link
              href={`/campus/${campusId}/network`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <span>Access Editor & Navigator</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}