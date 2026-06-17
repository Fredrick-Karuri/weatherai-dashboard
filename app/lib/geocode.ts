/**
 * geocode.ts
 *
 * Converts a city name to lat/lon coordinates using the Open-Meteo
 * Geocoding API — no API key required. Used by SearchBar on the client.
 */

import { GeocodeResult } from "./types";
import { GEOCODING_BASE_URL, GEOCODING_MAX_RESULTS } from "./config";


export class CityNotFoundError extends Error {
  constructor(cityName: string) {
    super(`No results found for "${cityName}". Try a different city name.`);
    this.name = "CityNotFoundError";
  }
}

export async function geocodeCity(cityName: string): Promise<GeocodeResult> {
  const url = new URL(GEOCODING_BASE_URL);
  url.searchParams.set("name", cityName);
  url.searchParams.set("count", String(GEOCODING_MAX_RESULTS));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new CityNotFoundError(cityName);
  }

  const first = data.results[0];

  return {
    lat: first.latitude,
    lon: first.longitude,
    displayName: first.name,
  };
}