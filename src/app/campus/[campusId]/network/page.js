import CampusNetworkWrapper from "@/_components/CampusNetworkWrapper";
import {
  fetchCampus,
  fetchLocations,
  fetchPathways,
} from "@/actions/campusActions";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Route, 
  PlusCircle, 
  ArrowLeft, 
  Compass, 
  Layers,
  ShieldAlert,
  Footprints
} from "lucide-react";

export const metadata = {
  title: "Campus Spatial Network | Campus Route Finder",
  description: "Interactive topological network, nodes, and pathways explorer.",
};

export default async function CampusNetwork({ params }) {
  const { campusId } = await params;

  const [campusRes, locationsRes, pathwaysRes] = await Promise.all([
    fetchCampus(campusId),
    fetchLocations(campusId),
    fetchPathways(campusId),
  ]);

  if (!campusRes?.success) {
    console.error("Failed to load campus details:", campusRes?.error);
  }
  if (!locationsRes?.success) {
    console.error("Failed to load locations:", locationsRes?.error);
  }
  if (!pathwaysRes?.success) {
    console.error("Failed to load pathways:", pathwaysRes?.error);
  }

  const campus = campusRes?.data ?? null;
  const locations = locationsRes?.data ?? [];
  const pathways = pathwaysRes?.data ?? [];

  if (!campus) {
    return (
      <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-destructive/20 bg-card/85 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Campus Node Unreachable</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Unable to retrieve the requested campus data from the spatial database.
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

  return (
    <div className="relative isolate flex-1">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/campus"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
              aria-label="Back to directory"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Compass className="h-3.5 w-3.5" />
                <span>Topological Network</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {campus.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/campus/${campusId}/location/new`}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card/80 px-3.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Add Location</span>
            </Link>
            <Link
              href={`/campus/${campusId}/network/new`}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Pathway</span>
            </Link>
          </div>
        </div>

        <CampusNetworkWrapper
          campus={campus}
          locations={locations}
          pathways={pathways}
        />
      </div>
    </div>
  );
}