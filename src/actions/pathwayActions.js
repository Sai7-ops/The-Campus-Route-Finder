"use server";

import { supabase } from "@/_lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function fetchMultiCampusPathways(
  start,
  end,
  toleranceRadius = 50,
) {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  const coords = `${lng1},${lat1};${lng2},${lat2}`;
  const url = new URL(
    `https://router.project-osrm.org/route/v1/foot/${coords}`,
  );

  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("alternatives", "true");

  const fetchRoutes = async () => {
    try {
      const res = await fetch(url.toString());

      if (!res.ok) return { success: false, routes: [] };
      const data = await res.json();
      return { success: true, routes: data.code == "Ok" ? data.routes : [] };
    } catch {
      return { success: false, routes: [] };
    }
  };

  const { routes } = await fetchRoutes();
  const leafletRoutes = [];

  routes.forEach((route) => {
    const leafletCoords = route.geometry.coordinates.map(([lng, lat]) => [
      lat,
      lng,
    ]);

    leafletCoords[0] = [lat1, lng1];
    leafletCoords[leafletCoords.length - 1] = [lat2, lng2];

    const distance_m = Math.round(route.distance);

    leafletRoutes.push({
      id: `route-${leafletRoutes.length + 1}`,
      distance_m,
      durationSec: Math.round(route.duration),
      coordinates: leafletCoords,
    });
  });

  console.log(leafletRoutes);

  return leafletRoutes.sort((a, b) => a.distance_m - b.distance_m);
}

export async function fetchMultiModeCampusPathways(
  start,
  end,
  toleranceRadius = 50,
) {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  const coords = `${lng1},${lat1};${lng2},${lat2}`;
  const baseParams = `overview=full&geometries=geojson&alternatives=true&radiuses=${toleranceRadius};${toleranceRadius}`;

  const profiles = [
    { key: "foot", label: "walk", icon: "🚶🏻‍♀️‍➡️" },
    { key: "bicycle", label: "Bicycle", icon: "🚲" },
    { key: "driving", label: "Car", icon: "🚗" },
  ];

  const fetchPromises = profiles.map(async (profile) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/${profile.key}/${coords}?${baseParams}`,
      );
      if (!res.ok) return { profile: profile.key, routes: [] };
      const data = await res.json();
      return {
        profile: profile.key,
        routes: data.code === "Ok" ? data.routes : [],
      };
    } catch {
      return { profile: profile.key, routes: [] };
    }
  });

  const results = await Promise.all(fetchPromises);

  const aggregateRoutes = [];

  results.forEach(({ profile, routes }) => {
    routes.forEach((route) => {
      const leafletCoords = route.geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);

      leafletCoords[0] = [lat1, lng1];
      leafletCoords[leafletCoords.length - 1] = [lat2, lng2];

      const distance_m = Math.round(route.distance);

      const existing = aggregateRoutes.find((r) => {
        if (Math.abs(r.distance_m - distance_m) > 5) {
          return false;
        }

        if (r.coordinates.length !== leafletCoords.length) {
          return false;
        }

        return r.coordinates.every(([lat, lng], i) => {
          const [otherLat, otherLng] = leafletCoords[i];

          return (
            Math.abs(lat - otherLat) < 0.00001 &&
            Math.abs(lng - otherLng) < 0.00001
          );
        });
      });

      if (existing) {
        if (!existing.modes.includes(profile)) {
          existing.modes.push(profile);
        }
      } else {
        aggregateRoutes.push({
          id: `route-${aggregateRoutes.length + 1}`,
          distance_m,
          durationSec: Math.round(route.duration),
          coordinates: leafletCoords,
          modes: [profile],
        });
      }
    });
  });

  if (aggregateRoutes.length === 0) {
    throw new Error(
      `No routable pathways found within ${toleranceRadius}m of these locations. Consider tracing manually.`,
    );
  }

  return aggregateRoutes.sort((a, b) => a.distance_m - b.distance_m);
}

export async function addPathway(payload) {
  try {
    const {
      campus_id,
      location1_id,
      location2_id,
      distance_m,
      is_blocked,
      tagsArray,
      cautionsArray,
      description,
      coordinates,
    } = payload;

    if (!location1_id || !location2_id || !distance_m || !coordinates) {
      return {
        success: false,
        error: "Fields are missing!",
      };
    }

    const { data, error } = await supabase
      .from("pathways")
      .insert([
        {
          campus_id,
          location1_id,
          location2_id,
          distance_m,
          is_blocked,
          tags: tagsArray,
          cautions: cautionsArray,
          description,
          coordinates,
        },
      ])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath(`/campus/${campus_id}`, "layout");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Failed to create Pathway!",
    };
  }
}
