"use client";

/**
 * SearchBar.tsx
 *
 * Client component. Provides a city name input and a "Use my location"
 * geolocation button. On submit, geocodes the city name via Open-Meteo
 * and fires the onSearch callback with resolved coordinates.
 */

import { useState, FormEvent } from "react";
import { geocodeCity, CityNotFoundError } from "@/app/lib/geocode";
import { GeocodeResult } from "@/app/lib/types";

interface SearchBarProps {
  onSearch: (result: GeocodeResult) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [cityInput, setCityInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  async function handleCitySubmit(event: FormEvent) {
    event.preventDefault();
    if (!cityInput.trim()) return;

    setError(null);
    try {
      const result = await geocodeCity(cityInput.trim());
      onSearch(result);
    } catch (err) {
      if (err instanceof CityNotFoundError) {
        setError(err.message);
      } else {
        setError("Failed to find city. Please try again.");
      }
    }
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError(null);
    setIsGeolocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocating(false);
        onSearch({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          displayName: "My Location",
        });
      },
      () => {
        setIsGeolocating(false);
        setError("Location access denied. Please search by city name.");
      }
    );
  }

  const isBusy = isLoading || isGeolocating;

  return (
    <div className="w-full">
      <form onSubmit={handleCitySubmit} className="flex gap-2">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Search city..."
          disabled={isBusy}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 transition"
        />
        <button
          type="submit"
          disabled={isBusy || !cityInput.trim()}
          className="px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium disabled:opacity-40 transition"
        >
          {isLoading ? "..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isBusy}
          title="Use my location"
          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition"
        >
          {isGeolocating ? "⏳" : "📍"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-300">{error}</p>
      )}
    </div>
  );
}