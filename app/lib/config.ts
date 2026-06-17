/**
 * config.ts
 *
 * Central configuration for the WeatherAI Dashboard.
 * All magic numbers, URLs, and tunable constants live here.
 * Import from this file — never hardcode values in components or helpers.
 */

// ── Default location (Nairobi, Kenya) ─────────────────────────────────────────
export const DEFAULT_LAT = -1.2921;
export const DEFAULT_LON = 36.8219;
export const DEFAULT_CITY = "Nairobi";

// ── WeatherAI API ─────────────────────────────────────────────────────────────
export const WEATHERAI_BASE_URL = "https://api.weather-ai.co";
export const WEATHERAI_UNITS = "metric";

// ── Internal route handlers ───────────────────────────────────────────────────
// Falls back to localhost in development; set NEXT_PUBLIC_APP_URL in production.
export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Caching ───────────────────────────────────────────────────────────────────
// How long (seconds) weather responses are cached before revalidation.
export const WEATHER_CACHE_TTL_SECONDS = 600; // 10 minutes

// ── Forecast display ─────────────────────────────────────────────────────────
export const HOURLY_SLOTS_TO_SHOW = 24;

// ── Geocoding (Open-Meteo) ────────────────────────────────────────────────────
export const GEOCODING_BASE_URL =
  "https://geocoding-api.open-meteo.com/v1/search";
export const GEOCODING_MAX_RESULTS = 1;