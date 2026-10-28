"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CampusNetwork({ campus, locations, pathways }) {
  console.log(locations);
  return (
    <>
      <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[campus.lat, campus.lng]}
          zoom={16}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {locations
            ? locations.map((location) => {
                return (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                  >
                    <Popup>
                      <div>
                        <h1>{location.name}</h1>
                        <p>{location.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })
            : null}
        </MapContainer>
      </div>
      <div>
        {locations?.length === 0 ? (
          <div>
            <h1>No locations added yet</h1>
            <Link href={`/campus/${campus.id}/location/new`}>
              Add New Locations
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
