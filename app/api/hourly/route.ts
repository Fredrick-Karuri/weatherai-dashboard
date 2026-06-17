/**
 * app/api/hourly/route.ts
 *
 * Server-side handler for 24-hour forecast.
 * Delegates to the active IWeatherProvider — no provider logic lives here.
 * Returns 400 on missing params; provider errors surface as 502.
 */

import { NextRequest, NextResponse } from "next/server";
import { weatherProvider } from "@/app/lib/providers";
import { WEATHER_CACHE_TTL_SECONDS } from "@/app/lib/config";

const MISSING_PARAMS_MESSAGE = "Missing required query parameters: lat and lon";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: MISSING_PARAMS_MESSAGE }, { status: 400 });
  }

  try {
    const slots = await weatherProvider.getHourlyForecast(
      parseFloat(lat),
      parseFloat(lon)
    );
    return NextResponse.json(slots, {
      headers: { "Cache-Control": `s-maxage=${WEATHER_CACHE_TTL_SECONDS}, stale-while-revalidate` },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}