/**
 * page.tsx
 *
 * Root server page. Reads lat/lon from URL search params (default: Nairobi).
 * Fetches current weather and hourly forecast server-side, then passes
 * data down to display components. WeatherShell handles client-side search.
 */

import { fetchCurrentWeather, fetchHourlyForecast } from "@/app/lib/weatherai";
import CurrentWeatherCard from "@/app/components/server/CurrentWeatherCard";
import HourlyForecastStrip from "@/app/components/client/HourlyForecastStrip";
import WeatherShell from "@/app/components/client/WeatherShell";

const DEFAULT_LAT = -1.2921;
const DEFAULT_LON = 36.8219;

interface PageProps {
  searchParams: Promise<{ lat?: string; lon?: string; city?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lat = params.lat ? parseFloat(params.lat) : DEFAULT_LAT;
  const lon = params.lon ? parseFloat(params.lon) : DEFAULT_LON;

  const [conditions, hourlySlots] = await Promise.all([
    fetchCurrentWeather(lat, lon),
    fetchHourlyForecast(lat, lon),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-white text-2xl font-bold tracking-tight">WeatherAI</h1>
          <p className="text-white/50 text-sm mt-1">Real-time forecasts powered by AI</p>
        </header>

        <WeatherShell>
          <CurrentWeatherCard conditions={conditions} />
          <HourlyForecastStrip slots={hourlySlots} />
        </WeatherShell>
      </div>
    </main>
  );
}