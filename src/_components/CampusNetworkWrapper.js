"use client";

import dynamic from "next/dynamic";

const CampusNetwork = dynamic(() => import("@/_components/CampusNetwork"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
      Loading campus map...
    </div>
  ),
});

export default function CampusNetworkWrapper({ locations, pathways, campus }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1>Campus Network</h1>
      <h1>{campus.name}</h1>
      <CampusNetwork locations={locations} pathways={pathways} campus={campus}/>
    </div>
  );
}
