
import { NextResponse } from 'next/server';
import { geocodeCity } from '@/app/lib/geocode';
import { fetchHourly } from '@/app/lib/weatherai';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get('city') || 'London';
    const loc = await geocodeCity(city);
    if (!loc) return NextResponse.json({ error: 'geocode failed' }, { status: 400 });
    const hourly = await fetchHourly(loc.lat, loc.lon);
    return NextResponse.json(hourly);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
