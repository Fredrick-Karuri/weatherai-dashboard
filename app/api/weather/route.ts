/**
 * app/api/weather/route.ts
 *
 * Server-side handler for current weather conditions.
 * Delegates to the active IWeatherProvider — no provider logic lives here.
 * Returns 400 on missing params; provider errors surface as 502.
 */

import { NextRequest, NextResponse } from "next/server";
import { weatherProvider } from "@/app/lib/providers";
import { WEATHER_CACHE_TTL_SECONDS } from "@/app/lib/config";

const MISSING_PARAMS_MESSAGE = "Missing required query parameters: lat, lon, and city";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city") ?? "Unknown";

  if (!lat || !lon) {
    return NextResponse.json({ error: MISSING_PARAMS_MESSAGE }, { status: 400 });
  }

  try {
    const conditions = await weatherProvider.getCurrentWeather(
      parseFloat(lat),
      parseFloat(lon),
      city
    );
    return NextResponse.json(conditions, {
      headers: { "Cache-Control": `s-maxage=${WEATHER_CACHE_TTL_SECONDS}, stale-while-revalidate` },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}