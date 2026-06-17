
import { WeatherResponse, HourlyResponse } from './types';

const KEY = process.env.WEATHERAI_API_KEY;

export async function fetchCurrentWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const url = `https://api.weatherai.example/v1/current?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.json();
}

export async function fetchHourly(lat: number, lon: number): Promise<HourlyResponse> {
  const url = `https://api.weatherai.example/v1/hourly?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.json();
}
