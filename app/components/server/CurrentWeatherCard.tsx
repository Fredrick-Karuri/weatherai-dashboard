/**
 * CurrentWeatherCard.tsx
 *
 * Server component. Displays current weather conditions for a location:
 * temperature, feels-like, humidity, wind speed, condition, and the
 * WeatherAI-generated AI summary. Accepts a CurrentConditions prop.
 */

import { CurrentConditions } from "@/app/lib/types";
import WeatherIcon from "./WeatherIcon";

interface CurrentWeatherCardProps {
  conditions: CurrentConditions;
}

export default function CurrentWeatherCard({ conditions }: CurrentWeatherCardProps) {
  const { cityName, temp, feelsLike, humidity, windSpeed, condition, aiSummary } = conditions;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl border border-white/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-white/60">
            Current Weather
          </p>
          <h2 className="text-3xl font-bold mt-1">{cityName}</h2>
          <p className="text-6xl font-thin mt-3">{temp}°C</p>
          <p className="text-white/70 mt-1 capitalize">{condition}</p>
        </div>
        <WeatherIcon condition={condition} className="w-20 h-20 opacity-90" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
        <StatBlock label="Feels like" value={`${feelsLike}°C`} />
        <StatBlock label="Humidity" value={`${humidity}%`} />
        <StatBlock label="Wind" value={`${windSpeed} km/h`} />
      </div>

      {aiSummary && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
            AI Summary
          </p>
          <p className="text-sm leading-relaxed text-white/80">{aiSummary}</p>
        </div>
      )}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-white/50 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}