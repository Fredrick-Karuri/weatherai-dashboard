/**
 * weatherai.ts
 *
 * Typed fetch helpers for WeatherAI data. Calls internal Next.js route
 * handlers (/api/weather, /api/hourly) so the API key never reaches
 * the client bundle.
 */

import { CurrentConditions, HourlySlot, WeatherApiResponse } from "./types";

const INTERNAL_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
  const url = new URL(path, INTERNAL_BASE_URL);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));

  const response = await fetch(url.toString(), { next: { revalidate: 600 } });

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

  const SLOTS_TO_SHOW = 24;

  return data.hourly.time.slice(0, SLOTS_TO_SHOW).map((time, index) => ({
    time,
    temp: Math.round(data.hourly!.temperature_2m[index]),
    condition: data.hourly!.weather_condition[index],
  }));
}