
import { NextResponse } from 'next/server';
import { geocodeCity } from '@/app/lib/geocode';
import { fetchCurrentWeather } from '@/app/lib/weatherai';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get('city') || 'London';
    const loc = await geocodeCity(city);
    if (!loc) return NextResponse.json({ error: 'geocode failed' }, { status: 400 });
    const weather = await fetchCurrentWeather(loc.lat, loc.lon);
    return NextResponse.json(weather);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
