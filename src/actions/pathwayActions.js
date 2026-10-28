"use server";

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
    { key: "foot", label: "walk", icon: "" },
    { key: "bicycle", label: "Bicycle", icon: "" },
    { key: "driving", label: "Car", icon: "" },
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

      const existing = aggregateRoutes.find((r) =>
        Math.abs(
          r.distance_m - distance_m <= 5 &&
            r.coordinates.length === leafletCoords.length,
        ),
      );

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

  if (aggregatedRoutes.length === 0) {
    throw new Error(
      `No routable pathways found within ${toleranceRadius}m of these locations. Consider tracing manually.`,
    );
  }

  return aggregateRoutes.sort((a, b) => a.distance_m - b.distance_m);
}
