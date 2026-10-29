import CampusSearchBar from "@/_components/CampusSearchBar";
import { addCampus } from "@/actions/campusActions";
import Link from "next/link";
import { ArrowLeft, Building2, Compass, Layers, MapPin, Sparkles } from "lucide-react";

export const metadata = {
  title: "Register Campus | Campus Route Finder",
  description: "Register a verified academic campus and calibrate its geographic coordinate datum.",
};

export default function NewCampus() {
  return (
    <div className="relative isolate flex-1">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/campus"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Directory</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner">
              <Building2 className="h-7 w-7" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Compass className="h-3.5 w-3.5" />
              <span>Campus Georeference Ingestion</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Register New Academic Campus
            </h1>

            <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Search verified university boundaries and colleges in India. Select an institution to anchor root coordinates and activate spatial routing.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <CampusSearchBar addCampus={addCampus} />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-3 border-t border-border/50 pt-8 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">LocationIQ Autocomplete</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Direct geocoding query restricted to universities, colleges, and schools across India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">Boundary Calibration</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Extracts latitude, longitude, state boundary, and validated structural address tokens.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">Graph Instantiation</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Sets base datum for multi-mode pathway network creation and endpoint snapping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}