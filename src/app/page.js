import Link from "next/link";
import { 
  Compass, 
  MapPin, 
  Route, 
  Footprints, 
  Bike, 
  Car, 
  Layers, 
  Navigation, 
  ShieldAlert, 
  ArrowRight, 
  Cpu
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative isolate flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary backdrop-blur-md">
          <Cpu className="h-3.5 w-3.5" />
          <span>Intelligent Graph Navigation Engine</span>
        </div>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Navigate your university campus with <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">meter-level precision</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Campus Route Finder bridges standard public cartography and inner-campus pedestrian walkways. Discover optimal, multi-modal routing between departments, lecture halls, and facilities.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/campus"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>Explore Registered Campuses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/campus/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-6 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>Map a New Campus</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Route className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">Multi-Modal Profiles</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Evaluate real-time route geometry across footpaths, bicycle tracks, and service transit roads with auto-snapping.
            </p>
          </div>

          <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Navigation className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">Topological Precision</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Guaranteed node connectivity. Eliminates broken endpoints with coordinate snapping for seamless routing graphs.
            </p>
          </div>

          <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">Blockage Intelligence</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Mark construction zones, active events, and temporary closures to reroute campus traffic on the fly.
            </p>
          </div>

          <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">GIS Vector Infrastructure</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Powered by PostGIS coordinate networks, Turf.js spatial analysis, and high-fidelity OpenStreetMap tiles.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card/30 p-8 backdrop-blur-md sm:p-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-xl text-left">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Compass className="h-4 w-4" />
                <span>Engineered for University Ecosystems</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready to explore or register your campus network?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Browse detailed structural maps, verify accessible pathway clearance, and trace custom indoor and outdoor connectors.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground">
                  <Footprints className="h-3.5 w-3.5 text-primary" /> Walking Corridors
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground">
                  <Bike className="h-3.5 w-3.5 text-primary" /> Cycle Tracks
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground">
                  <Car className="h-3.5 w-3.5 text-primary" /> Service Vehicle Access
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto">
              <Link
                href="/campus"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                Launch Campus Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}