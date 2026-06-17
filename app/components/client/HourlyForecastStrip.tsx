"use client";

/**
 * HourlyForecastStrip.tsx
 *
 * Client component. Renders a horizontally scrollable strip of hourly
 * forecast cards showing time, condition icon, and temperature.
 * Manages scroll state internally.
 */

import { HourlySlot } from "@/app/lib/types";
import WeatherIcon from "@/app/components/server/WeatherIcon";

interface HourlyForecastStripProps {
  slots: HourlySlot[];
}

const HOUR_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  hour12: true,
};

function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("en-US", HOUR_FORMAT_OPTIONS);
}

export default function HourlyForecastStrip({ slots }: HourlyForecastStripProps) {
  if (slots.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-white shadow-xl border border-white/20">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
        24-Hour Forecast
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {slots.map((slot, index) => (
          <HourlySlotCard key={index} slot={slot} />
        ))}
      </div>
    </div>
  );
}

function HourlySlotCard({ slot }: { slot: HourlySlot }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[60px] bg-white/10 rounded-xl px-3 py-3">
      <p className="text-xs text-white/60 whitespace-nowrap">{formatHour(slot.time)}</p>
      <WeatherIcon condition={slot.condition} className="w-7 h-7" />
      <p className="text-sm font-semibold">{slot.temp}°</p>
    </div>
  );
}