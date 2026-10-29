"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const NewLocationMap = dynamic(() => import("@/_components/NewLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] w-full flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md lg:h-[680px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Mounting Spatial Capture Canvas...
      </p>
    </div>
  ),
});

export default function NewLocationMapWrapper({ campus, locations }) {
  return (
    <div className="w-full">
      <NewLocationMap campus={campus} locations={locations} />
    </div>
  );
}