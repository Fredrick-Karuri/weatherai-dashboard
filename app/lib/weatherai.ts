/**
 * weatherai.ts
 *
 * Typed fetch helpers for WeatherAI data. Calls internal Next.js route
 * handlers (/api/weather, /api/hourly) so the API key never reaches
 * the client bundle.
 */

import { CurrentConditions, HourlySlot, WeatherApiResponse } from "./types";
import { APP_BASE_URL, HOURLY_SLOTS_TO_SHOW, WEATHER_CACHE_TTL_SECONDS } from "./config";


export class WeatherFetchError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "WeatherFetchError";
  }
}

async function fetchFromRouteHandler(
  path: string,
  lat: number,
  lon: number
): Promise<WeatherApiResponse> {
  const url = new URL(path, APP_BASE_URL);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));

  const response = await fetch(url.toString(), { next: { revalidate: WEATHER_CACHE_TTL_SECONDS } });

  if (!response.ok) {
    throw new WeatherFetchError(
      response.status,
      `Weather request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentConditions> {
  const data = await fetchFromRouteHandler("/api/weather", lat, lon);

  return {
    cityName: data.location?.name ?? "Unknown",
    temp: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    condition: data.current.weather_condition,
    aiSummary: data.ai_summary ?? "",
  };
}

export async function fetchHourlyForecast(
  lat: number,
  lon: number
): Promise<HourlySlot[]> {
  const data = await fetchFromRouteHandler("/api/hourly", lat, lon);

  if (!data.hourly) return [];

  return data.hourly.time.slice(0, HOURLY_SLOTS_TO_SHOW).map((time, index) => ({
    time,
    temp: Math.round(data.hourly!.temperature_2m[index]),
    condition: data.hourly!.weather_condition[index],
  }));
}