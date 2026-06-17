/**
 * types.ts
 *
 * Shared TypeScript interfaces for WeatherAI API responses.
 * Used across route handlers, fetch helpers, and UI components.
 */

export interface CurrentConditions {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  aiSummary: string;
  cityName: string;
}

export interface HourlySlot {
  time: string; // ISO 8601
  temp: number;
  condition: string;
}

export interface WeatherApiResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_condition: string;
  };
  ai_summary: string;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_condition: string[];
  };
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export interface SearchParams {
  lat: string;
  lon: string;
  city: string;
}