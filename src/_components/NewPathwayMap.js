"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchMultiModeCampusPathways } from "@/actions/pathwayActions";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ROUTE_COLORS = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];

export default function NewPathwayMap({ campus, locations, pathways }) {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [loc1, setLoc1] = useState(null);
  const [loc2, setLoc2] = useState(null);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [cautions, setCautions] = useState([]);
  const [caution, setCaution] = useState("");
  const [description, setDescription] = useState({ draft: "", saved: "" });

  useEffect(() => {
    let active = true;

    async function getRoutes() {
      setIsLoading(true);
      setError(null);
      try {
        const paths = await fetchMultiModeCampusPathways(
          [loc1.lat, loc1.lng],
          [loc2.lat, loc2.lng],
          50,
        );

        if (active) {
          setRoutes(paths);
          setSelectedRouteId(paths[0]?.id || null);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    if (loc1 && loc2) getRoutes();

    return () => {
      active = false;
    };
  }, [loc1, loc2]);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const selectOrigin = (id) => {
    const location = locations.find((loc) => loc.id === id);
    setLoc1(location);
  };

  const selectTarget = (id) => {
    const location = locations.find((loc) => loc.id === id);
    setLoc2(location);
  };

  const addPathway = () => {
    const route = routes.find((route) => route.id === selectedRouteId);
    const payload = {
      campus_id: campus.id,
      location1_id: loc1.id,
      location2_id: loc2.id,
      distance_m: route.distance_m,
      is_blocked: false,
      coordinates: route.coordinates,
    };
  };

  const addTag = () => {
    setTags((prevTags) => {
      return prevTags.push({ id: prevTags.length + 1, tag });
    });
    setTag("");
  };

  const addCaution = () => {
    setCautions((prevCautions) => {
      return prevCautions.push({ id: prevCautions.length + 1, caution });
    });
    setCaution("");
  };

  const saveDescription = () => {
    setDescription((prev) => {
      return { draft: "", saved: prev.draft };
    });
  };

  const removeTag = (id) => {
    const newTags = tags.filter((tag) => tag.id != id);
    setTags(newTags);
  };

  const removeCaution = (id) => {
    const newCautions = cautions.filter((caution) => caution.id != id);
    setCautions(newCautions);
  };

  const removeDescription = () => {
    setDescription((prev) => {
      return { draft: prev.draft, saved: "" };
    });
  };

  return (
    <>
      <div className="h-110 w-full rounded-lg overflow-hidden border border-gray-200">
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
                        {loc1?.id == location.id ? (
                          <h1>Selected Origin Location</h1>
                        ) : null}
                        {loc2?.id == location.id ? (
                          <h1>Selected Target Location</h1>
                        ) : null}
                        <h1>{location.name}</h1>
                        <p>{location.description}</p>

                        {loc1?.id == location.id && (
                          <div>
                            <button onClick={() => selectTarget(location.id)}>
                              Select as target
                            </button>
                          </div>
                        )}

                        {loc2?.id == location.id && (
                          <div>
                            <button onClick={() => selectOrigin(location.id)}>
                              Select as origin
                            </button>
                          </div>
                        )}
                        {loc1?.id != location.id && loc2?.id != location.id && (
                          <>
                            <div>
                              <button onClick={() => selectOrigin(location.id)}>
                                Select as origin
                              </button>
                            </div>
                            <div>
                              <button onClick={() => selectTarget(location.id)}>
                                Select as target
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })
            : null}

          {isLoading && (
            <div className="text-gray-500 py-6 text-center text-xs animate-pulse">
              Analyzing pedestrian, cycle, and service road access...
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                {error}
              </p>
              <button
                type="button"
                onClick={onSwitchToManual}
                className="w-full text-xs py-2 px-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
              >
                Trace Manually Instead
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            routes.length > 0 &&
            routes.map((route, idx) => {
              const isSelected = route.id === selectedRouteId;
              const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];

              return (
                <Polyline
                  key={route.id}
                  positions={route.coordinates}
                  eventHandlers={{
                    click: () => setSelectedRouteId(route.id),
                  }}
                  pathOptions={{
                    color: isSelected ? color : "#94a3b8",
                    weight: isSelected ? 6 : 3,
                    opacity: isSelected ? 1.0 : 0.45,
                    dashArray: isSelected ? null : "4, 6",
                  }}
                >
                  {route.id === selectedRouteId ? (
                    <Popup>
                      <p>
                        Pathway {idx + 1} {idx === 0 && "(Shortest)"}
                      </p>
                      <div>
                        {route.modes.includes("foot") && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                            🚶 Walk
                          </span>
                        )}
                        {route.modes.includes("bicycle") && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                            🚲 Bike
                          </span>
                        )}
                        {route.modes.includes("driving") && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                            🚗 Car
                          </span>
                        )}
                      </div>
                    </Popup>
                  ) : null}
                </Polyline>
              );
            })}
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
      <div>
        <div>
          <label htmlFor="tags">Add Tags</label>
          <input
            type="text"
            id="tags"
            placeholder="tags"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button onClick={addTag}>Add Tag</button>
        </div>
        <div>
          <label htmlFor="cautions">Add Cautions</label>
          <input
            type="text"
            id="cautions"
            placeholder="cautions"
            value={caution}
            onChange={(e) => setCaution(e.target.value)}
          />
          <button onClick={addCaution}>Add Caution</button>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            cols="50"
            placeholder="Add description"
            value={description.draft}
            onChange={(e) => e.target.value}
          ></textarea>
          <button onClick={saveDescription}>Save Description</button>
        </div>

        <div>
          <div>
            {tags.map((tag) => {
              <>
                <h1>Tags</h1>
                <p>{tag.tag}</p>
                <button onClick={() => removeTag(tag.id)}>Remove tag</button>
              </>;
            })}
          </div>
          <div>
            {cautions.map((caution) => {
              <>
                <h1>Cautions</h1>
                <p>{caution.caution}</p>
                <button onClick={() => removeCaution(caution.id)}>
                  Remove caution
                </button>
              </>;
            })}
          </div>
          <div>
            <h1>Description</h1>
            <p>{description.saved}</p>
            <button onClick={removeDescription}>Remove Description</button>
          </div>
          <div>
            <button
              type="button"
              onClick={addPathway}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs transition shadow-sm"
            >
              Save Selected Pathway
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Create form to collect tags, cautions and description
// add tag adding mechanism where on add append to an array of objects and then display them, users can remove specific tag by clicking X symbol
