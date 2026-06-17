/**
 * app/lib/providers/index.ts
 *
 * Resolves and exports the active IWeatherProvider based on environment.
 * WeatherAI is used when WEATHERAI_API_KEY is present; Open-Meteo otherwise.
 * All route handlers import from here — never from a provider directly.
 */

import { IWeatherProvider } from "./types";
import { OpenMeteoProvider } from "./openmeteo";
import { WeatherAiProvider } from "./weatherai";

function resolveProvider(): IWeatherProvider {
  if (process.env.WEATHERAI_API_KEY) {
    return new WeatherAiProvider();
  }
  return new OpenMeteoProvider();
}

export const weatherProvider: IWeatherProvider = resolveProvider();