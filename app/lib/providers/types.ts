/**
 * app/lib/providers/types.ts
 *
 * IWeatherProvider interface — the contract all weather provider
 * implementations must satisfy. Route handlers depend only on this
 * interface, never on a concrete provider directly.
 */

import { CurrentConditions, HourlySlot } from "../types";

export interface IWeatherProvider {
  getCurrentWeather(lat: number, lon: number, cityName: string): Promise<CurrentConditions>;
  getHourlyForecast(lat: number, lon: number): Promise<HourlySlot[]>;
}