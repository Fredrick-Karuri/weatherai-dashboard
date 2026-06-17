/**
 * app/api/hourly/route.ts
 *
 * Server-side proxy for WeatherAI GET /v1/hourly.
 * Keeps WEATHERAI_API_KEY off the client bundle.
 * Returns 400 on missing params; forwards WeatherAI status codes on error.
 */

import { NextRequest, NextResponse } from "next/server";
import { WEATHERAI_BASE_URL, WEATHERAI_UNITS, WEATHER_CACHE_TTL_SECONDS } from "@/app/lib/config";

const MISSING_PARAMS_MESSAGE = "Missing required query parameters: lat and lon";
const MISSING_API_KEY_MESSAGE = "WEATHERAI_API_KEY environment variable is not set";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: MISSING_PARAMS_MESSAGE }, { status: 400 });
  }

  const apiKey = process.env.WEATHERAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: MISSING_API_KEY_MESSAGE }, { status: 500 });
  }

  const upstreamUrl = new URL(`${WEATHERAI_BASE_URL}/v1/hourly`);
  upstreamUrl.searchParams.set("lat", lat);
  upstreamUrl.searchParams.set("lon", lon);
  upstreamUrl.searchParams.set("units", WEATHERAI_UNITS);

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: WEATHER_CACHE_TTL_SECONDS },
  });

  const data = await upstreamResponse.json();

  return NextResponse.json(data, { status: upstreamResponse.status });
}