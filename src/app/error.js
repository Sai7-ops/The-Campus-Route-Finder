'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home, Terminal } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      <div className="relative w-full max-w-lg rounded-3xl border border-destructive/20 bg-card/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive shadow-inner">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-destructive">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
            </span>
            Telemetry Exception Detected
          </div>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Spatial Engine Failure
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            An unexpected error interrupted route generation or spatial node resolution.
          </p>
        </div>

        {error?.message && (
          <div className="mt-6 rounded-xl border border-border/80 bg-secondary/50 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>Trace Output</span>
            </div>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground break-all line-clamp-3">
              {error.message}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reinitialize Connection</span>
          </button>

          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-all hover:bg-secondary sm:w-auto"
          >
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}