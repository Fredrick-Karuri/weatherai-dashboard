/**
 * app/lib/providers/weatherai.ts
 *
 * IWeatherProvider implementation backed by WeatherAI REST API.
 * Requires WEATHERAI_API_KEY environment variable.
 * Activated automatically when the key is present in config.
 * Docs: https://weather-ai.co/docs
 */

import { CurrentConditions, HourlySlot } from "../types";
import { IWeatherProvider } from "./types";
import { WEATHERAI_BASE_URL, WEATHERAI_UNITS, HOURLY_SLOTS_TO_SHOW } from "../config";

const MISSING_API_KEY_MESSAGE = "WEATHERAI_API_KEY is not set — cannot use WeatherAI provider";

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

function buildWeatherAiUrl(path: string, lat: number, lon: number): URL {
  const url = new URL(`${WEATHERAI_BASE_URL}${path}`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("units", WEATHERAI_UNITS);
  return url;
}

export class WeatherAiProvider implements IWeatherProvider {
  private readonly apiKey: string;

  constructor() {
    const key = process.env.WEATHERAI_API_KEY;
    if (!key) throw new Error(MISSING_API_KEY_MESSAGE);
    this.apiKey = key;
  }

  async getCurrentWeather(lat: number, lon: number, cityName: string): Promise<CurrentConditions> {
    const url = buildWeatherAiUrl("/v1/weather", lat, lon);
    const response = await fetch(url.toString(), {
      headers: buildAuthHeaders(this.apiKey),
    });

    if (!response.ok) {
      throw new Error(`WeatherAI current weather failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      cityName: data.location?.name ?? cityName,
      temp: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      condition: data.current.weather_condition,
      aiSummary: data.ai_summary ?? "",
    };
  }

  async getHourlyForecast(lat: number, lon: number): Promise<HourlySlot[]> {
    const url = buildWeatherAiUrl("/v1/hourly", lat, lon);
    const response = await fetch(url.toString(), {
      headers: buildAuthHeaders(this.apiKey),
    });

    if (!response.ok) {
      throw new Error(`WeatherAI hourly forecast failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.hourly) return [];

    return data.hourly.time
      .slice(0, HOURLY_SLOTS_TO_SHOW)
      .map((time: string, index: number) => ({
        time,
        temp: Math.round(data.hourly.temperature_2m[index]),
        condition: data.hourly.weather_condition[index],
      }));
  }
}