import NewPathwayMapWrapper from "@/_components/NewPathwayMapWrapper";
import { supabase } from "@/_lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft, Compass, Route, ShieldAlert, Waypoints } from "lucide-react";

export const metadata = {
  title: "Trace Pathway Vector | Campus Route Finder",
  description: "Synthesize multi-modal edge routing and calibrate topological campus pathways.",
};

export default async function NewPathway({ params }) {
  const { campusId } = await params;

  const [
    { data: campus, error: campusError },
    { data: locations = [], error: locationsError },
    { data: pathways = [], error: pathwaysError },
  ] = await Promise.all([
    supabase.from("campuses").select("*").eq("id", campusId).single(),
    supabase.from("locations").select("*").eq("campus_id", campusId),
    supabase.from("pathways").select("*").eq("campus_id", campusId),
  ]);

  if (campusError || !campus) {
    return (
      <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-destructive/20 bg-card/85 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Campus Node Unreachable</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Unable to load reference campus datum to trace new pathways.
          </p>
          <Link
            href="/campus"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  if (locationsError) {
    console.error("Failed to load locations:", locationsError.message);
  }
  if (pathwaysError) {
    console.error("Failed to load pathways:", pathwaysError.message);
  }

  return (
    <div className="relative isolate flex-1">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/campus/${campusId}/network`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
              aria-label="Back to network"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Compass className="h-3.5 w-3.5" />
                <span>Vector Graph Synthesizer</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Add Topological Pathway
              </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
            <Waypoints className="h-3.5 w-3.5 text-primary" />
            <span className="text-foreground font-semibold">{campus.name}</span>
          </div>
        </div>

        <NewPathwayMapWrapper
          campus={campus}
          locations={locations}
          pathways={pathways}
        />
      </div>
    </div>
  );
}