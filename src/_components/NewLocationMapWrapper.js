"use client";

import dynamic from "next/dynamic";

const NewLocationMap = dynamic(() => import("@/_components/NewLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
      Loading campus map...
    </div>
  ),
});

export default function NewLocationMapWrapper({campus, locations}) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1>Click on map to select a location in {campus.name}</h1>
      <NewLocationMap campus={campus} locations={locations}/>
    </div>
  );
}
