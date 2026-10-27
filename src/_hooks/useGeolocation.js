'use client';

import { useState, useEffect } from 'react';

export function useSimpleLocation() {
  const [coords, setCoords] = useState(null); 

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  return coords;
}