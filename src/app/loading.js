import { Compass, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-primary/10 blur-xl animate-pulse" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-xl">
            <Compass className="h-7 w-7 text-primary animate-spin [animation-duration:6s]" />
          </div>

          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-xs">
            <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Initializing Telemetry
          </div>

          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Campus Route Finder
          </h2>

          <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
            Resolving spatial vector nodes and map geometry...
          </p>
        </div>
      </div>
    </div>
  );
}