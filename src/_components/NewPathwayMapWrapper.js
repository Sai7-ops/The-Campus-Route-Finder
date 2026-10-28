"use client";

import dynamic from "next/dynamic";

const NewPathwayMap = dynamic(() => import("@/_components/NewPathwayMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
      Loading Pathway map...
    </div>
  ),
});

export default function NewPathwayMapWrapper({campus, locations}) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1>Click on map to select a location in {campus.name}</h1>
      <NewPathwayMap campus={campus} locations={locations}/>
    </div>
  );
}
