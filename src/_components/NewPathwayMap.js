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
import {
  fetchMultiModeCampusPathways,
  addPathway,
  fetchMultiCampusPathways
} from "@/actions/pathwayActions";
import { toast } from "react-toastify";

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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setRoutes([]);
    setSelectedRouteId(null);
    setError(null);
    async function getRoutes() {
      setIsLoading(true);
      setError(null);
      try {
        const paths = await fetchMultiCampusPathways(
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

  const addTag = () => {
    setTags((prevTags) => {
      return [...prevTags, { id: crypto.randomUUID(), tag }];
    });
    setTag("");
  };

  const addCaution = () => {
    setCautions((prevCautions) => {
      return [...prevCautions, { id: crypto.randomUUID(), caution }];
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

  const onConfirm = async () => {
    if (isSaving) return;

    const selectedRoute = routes.find((route) => route.id === selectedRouteId);

    if (!loc1 || !loc2 || loc1.id === loc2.id) {
      toast.error("Select two different locations.");
      return;
    }

    if (!selectedRouteId || isLoading) {
      toast.error("Please select a valid pathway.");
      return;
    }

    const payload = {
      campus_id: campus.id,
      location1_id: loc1.id,
      location2_id: loc2.id,
      distance_m: selectedRoute.distance_m,
      is_blocked: false,
      tagsArray: tags.map((item) => item.tag),
      cautionsArray: cautions.map((item) => item.caution),
      description: description.saved,
      coordinates: selectedRoute.coordinates,
    };

    try {
      setIsSaving(true);

      const result = await addPathway(payload);

      if (!result.success) {
        toast.error(result.error || "Failed to add pathway.");
        return;
      }

      toast.success("Successfully added new pathway!");

      setLoc1(null);
      setLoc2(null);
      setRoutes([]);
      setSelectedRouteId(null);
      setTags([]);
      setCautions([]);
      setTag("");
      setCaution("");
      setDescription({ draft: "", saved: "" });
    } catch (err) {
      toast.error(err.message || "Failed to add pathway.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
          {/* <button
                type="button"
                onClick={onSwitchToManual}
                className="w-full text-xs py-2 px-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
              >
                Trace Manually Instead
              </button> */}
        </div>
      )}

      {!isLoading && !error && routes.length === 0 && (
        <h1>
          No Pathways found for this set of locations, consider tracing
          manually!
        </h1>
      )}

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

          {pathways?.map((pathway) => {
            return (
              <Polyline
                key={pathway.id}
                positions={pathway.coordinates}
                pathOptions={{
                  color: "#94a3b8",
                  weight: 6,
                  opacity: 1.0,
                  dashArray: null,
                }}
              >
                <Popup>
                  <p>Pathway ID #{pathway.id}</p>
                  <p>Distance: {pathway.distance_m}</p>
                  <div>
                    <p>Tags</p>
                    {pathway.tags?.map((tag, idx) => (
                      <p key={idx + 1}>{tag}</p>
                    ))}
                  </div>
                  <div>
                    <p>Cautions</p>
                    {pathway.cautions?.map((caution, idx) => (
                      <p key={idx + 1}>{caution}</p>
                    ))}
                  </div>
                  <p>Description</p>
                  <p>
                    {pathway?.description
                      ? pathway.description
                      : "Description Not Provided"}
                  </p>
                </Popup>
              </Polyline>
            );
          })}

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
            onChange={(e) =>
              setDescription((prev) => {
                return { ...prev, draft: e.target.value };
              })
            }
          ></textarea>
          <button onClick={saveDescription}>Save Description</button>
        </div>

        <div>
          <div>
            {tags.map((tag) => {
              return (
                <div key={tag.id}>
                  <h1>Tags</h1>
                  <p>{tag.tag}</p>
                  <button onClick={() => removeTag(tag.id)}>Remove tag</button>
                </div>
              );
            })}
          </div>
          <div>
            {cautions.map((caution) => {
              return (
                <div key={caution.id}>
                  <h1>Cautions</h1>
                  <p>{caution.caution}</p>
                  <button onClick={() => removeCaution(caution.id)}>
                    Remove caution
                  </button>
                </div>
              );
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
              disabled={
                isSaving || isLoading || !selectedRouteId || !loc1 || !loc2
              }
              onClick={onConfirm}
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
