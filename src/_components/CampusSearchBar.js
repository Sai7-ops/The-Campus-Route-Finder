"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { 
  Search, 
  Loader2, 
  Building2, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  X,
  Compass
} from "lucide-react";

export default function CampusSearchBar({ addCampus }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const containerRef = useRef(null);
  const LOCATIONIQ_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
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
          "amenity:university,amenity:college,amenity:school"
        );
        url.searchParams.set("dedupe", "1");
        url.searchParams.set("limit", "5");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setIsOpen(true);
      } catch (err) {
        console.error("LocationIQ autocomplete error: ", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, LOCATIONIQ_KEY]);

  const handleSelectCampus = async (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const placeTitle = item.display_place || item.display_name?.split(",")[0] || "University Campus";

    setSelectedPlaceId(item.place_id);
    setIsSubmitting(true);

    try {
      const result = await addCampus({
        name: placeTitle,
        lat,
        lng,
        address: item.display_address || item.display_name,
        state: item.address?.state || "",
      });

      if (result?.success) {
        toast.success(`Campus "${placeTitle}" registered successfully!`);
        setQuery("");
        setIsOpen(false);
      } else {
        toast.error(result?.error || "Failed to register campus");
      }
    } catch (err) {
      toast.error("Network exception during campus registration");
    } finally {
      setIsSubmitting(false);
      setSelectedPlaceId(null);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search institution name (e.g. MANIT Bhopal, IIT Bombay)..."
          className="h-12 w-full rounded-2xl border border-border/80 bg-secondary/40 pr-10 pl-11 text-xs text-foreground placeholder:text-muted-foreground/60 backdrop-blur-md transition-all focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-3.5 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border/90 bg-card p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Compass className="h-3 w-3 text-primary" /> Verified Geocoding Candidates
            </span>
            <span>{suggestions.length} Found</span>
          </div>

          <div className="mt-1 flex flex-col gap-1 max-h-80 overflow-y-auto">
            {suggestions.map((item) => {
              const placeTitle = item.display_place || item.display_name?.split(",")[0];
              const isCurrentAdding = isSubmitting && selectedPlaceId === item.place_id;

              return (
                <div
                  key={item.place_id}
                  className="group flex items-center justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-secondary/70"
                >
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {placeTitle}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
                        <span className="truncate">{item.display_name}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                        <span>{parseFloat(item.lat).toFixed(4)}°N</span>
                        <span>•</span>
                        <span>{parseFloat(item.lon).toFixed(4)}°E</span>
                        {item.address?.state && (
                          <>
                            <span>•</span>
                            <span className="font-sans text-primary font-medium">{item.address.state}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectCampus(item)}
                    className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isCurrentAdding ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Register</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}