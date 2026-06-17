/**
 * app/api/weather/route.ts
 *
 * Server-side proxy for WeatherAI GET /v1/weather.
 * Keeps WEATHERAI_API_KEY off the client bundle.
 * Returns 400 on missing params; forwards WeatherAI status codes on error.
 */

import { NextRequest, NextResponse } from "next/server";

const WEATHERAI_BASE_URL = "https://api.weather-ai.co";
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

  const upstreamUrl = new URL(`${WEATHERAI_BASE_URL}/v1/weather`);
  upstreamUrl.searchParams.set("lat", lat);
  upstreamUrl.searchParams.set("lon", lon);
  upstreamUrl.searchParams.set("units", "metric");

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 600 },
  });

  const data = await upstreamResponse.json();

  return NextResponse.json(data, { status: upstreamResponse.status });
}