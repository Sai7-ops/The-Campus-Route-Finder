"use client";

import dynamic from "next/dynamic";

const CampusMap = dynamic(() => import("@/_components/CampusMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
      Loading campus map...
    </div>
  ),
});

export default function CampusPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Display available campuses</h1>
      <CampusMap />
    </div>
  );
}