"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const AvailableCampusesMap = dynamic(() => import("@/_components/AvailableCampusesMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
      Loading campus map...
    </div>
  ),
});

export default function CampusPage({ campuses }) {
  if (campuses.length == 0)
    return (
      <div>
        <h1>OOPS! No campus added yet</h1>
        <Link href="/campus/add">Add Campus</Link>
      </div>
    );
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1>{campuses.length} Campuses Available</h1>
      <div>
        {campuses.map((campus) => {
          return (
            <div key={campus.id}>
              <div>
                <h1>{campus.name}</h1>
                <p>{campus.address}</p>
                <p>{campus.state}</p>
              </div>

              <div>
                <Link href={`/campus/${campus.id}/network`}>View Campus Network</Link>
              </div>
            </div>
          );
        })}
      </div>
      <AvailableCampusesMap campuses={campuses}/>
    </div>
  );
}
