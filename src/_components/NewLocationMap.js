"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import addLocation from "@/actions/locationActions";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ClickHandler = ({ onSelectLocation }) => {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng);
    },
  });
};

export default function NewLocationMap({ campus }) {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      return await addLocation(formData);
    },
    null,
  );

  useEffect(() => {
    state?.success ? toast.success("Location saved successfully!") : null;
    state?.error ? toast.error(state.error) : null;
  }, [state]);

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng);
  };
  return (
    <>
      <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[campus.lat, campus.lng]}
          zoom={19}
          maxZoom={21}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={21}
            maxNativeZoom={19}
          />

          <ClickHandler onSelectLocation={handleMapClick} />

          {selectedPosition && (
            <Marker position={selectedPosition}>
              <Popup>
                Selected: {selectedPosition.lat.toFixed(6)},{" "}
                {selectedPosition.lng.toFixed(6)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div>
        <form action={formAction} className="space-y-4 max-w-md">
          <input type="hidden" name="campusId" value={campus.campusId} />
          <input type="hidden" name="lat" value={selectedPosition?.lat || ""} />
          <input type="hidden" name="lng" value={selectedPosition?.lng || ""} />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g., Computer Center Gate"
              className="mt-1 block w-full border rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Nearby landmarks, entry notes..."
              className="mt-1 block w-full border rounded-md p-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !selectedPosition}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 text-sm font-medium"
          >
            {isPending ? "Saving..." : "Add Location"}
          </button>
        </form>
      </div>
    </>
  );
}
