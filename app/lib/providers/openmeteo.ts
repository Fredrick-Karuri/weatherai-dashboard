/**
 * app/lib/providers/openmeteo.ts
 *
 * IWeatherProvider implementation backed by Open-Meteo.
 * No API key required. Used as fallback when WEATHERAI_API_KEY is absent.
 * Docs: https://open-meteo.com/en/docs
 */

import { CurrentConditions, HourlySlot } from "../types";
import { IWeatherProvider } from "./types";
import { WEATHERAI_UNITS, HOURLY_SLOTS_TO_SHOW } from "../config";

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "wind_speed_10m",
  "weather_code",
].join(",");

const HOURLY_FIELDS = ["temperature_2m", "weather_code"].join(",");
const FORECAST_DAYS = "1";

const TEMPERATURE_UNIT = WEATHERAI_UNITS === "metric" ? "celsius" : "fahrenheit";
const WIND_SPEED_UNIT = WEATHERAI_UNITS === "metric" ? "kmh" : "mph";

function mapWeatherCodeToCondition(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function buildForecastUrl(lat: number, lon: number, fields: Record<string, string>): URL {
  const url = new URL(OPEN_METEO_FORECAST_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("temperature_unit", TEMPERATURE_UNIT);
  url.searchParams.set("wind_speed_unit", WIND_SPEED_UNIT);
  Object.entries(fields).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}

export class OpenMeteoProvider implements IWeatherProvider {
  async getCurrentWeather(lat: number, lon: number, cityName: string): Promise<CurrentConditions> {
    const url = buildForecastUrl(lat, lon, { current: CURRENT_FIELDS });
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Open-Meteo current weather failed: ${response.status}`);
    }

    const raw = await response.json();
    const current = raw.current;

    return {
      cityName,
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      condition: mapWeatherCodeToCondition(current.weather_code),
      aiSummary: "",
    };
  }

  async getHourlyForecast(lat: number, lon: number): Promise<HourlySlot[]> {
    const url = buildForecastUrl(lat, lon, {
      hourly: HOURLY_FIELDS,
      forecast_days: FORECAST_DAYS,
    });
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Open-Meteo hourly forecast failed: ${response.status}`);
    }

    const raw = await response.json();

    return raw.hourly.time
      .slice(0, HOURLY_SLOTS_TO_SHOW)
      .map((time: string, index: number) => ({
        time,
        temp: Math.round(raw.hourly.temperature_2m[index]),
        condition: mapWeatherCodeToCondition(raw.hourly.weather_code[index]),
      }));
  }
}