"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CampusSearchBar({ addCampus }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const LOCATIONIQ_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      isLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = new URL("https://api.locationiq.com/v1/autocomplete");
        url.searchParams.set("key", LOCATIONIQ_KEY);
        url.searchParams.set("q", query.trim());
        url.searchParams.set("countrycodes", "in");
        url.searchParams.set(
          "tag",
          "amenity:university,amenity:college,amenity:school",
        );
        url.searchParams.set("dedupe", "1");
        url.searchParams.set("limit", "5");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const data = await res.json();

        setSuggestions(data);
        setIsOpen(true);
      } catch (err) {
        console.error("LocationIQ autocomplete error: ", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isLoading, LOCATIONIQ_KEY]);

  const handleClick = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    const result = addCampus({
      name: item.display_place,
      lat,
      lng,
      address: item.display_address,
      state: item.address.state,
    });

    setQuery(item.display_place);
    setIsOpen(false);

    if (result.success) {
      toast.success(`Campus "${item.display_place}" added successfully!`);
    } else {
      toast.error(result.error || "Failed to add campus");
    }
  };

  return (
    <div className="relative w-full max-w-md z-1000">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search university or college in India..."
        className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      {isLoading && (
        <div className="absolute right-3 top-3 text-xs text-gray-400">
          Searching...
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden divide-y divide-gray-100 text-sm max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-left transition-colors"
            >
              <div className="font-semibold text-gray-800">
                {item.display_name.split(",")[0]}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {item.display_name}
              </div>
              <div>
                <button onClick={() => handleClick(item)}>Add</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
