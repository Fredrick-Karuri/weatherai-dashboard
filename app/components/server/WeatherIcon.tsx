/**
 * WeatherIcon.tsx
 *
 * Server component. Maps a WeatherAI condition string to a distinct
 * inline SVG icon. No external icon library dependency.
 */

interface WeatherIconProps {
  condition: string;
  className?: string;
}

import { ReactElement } from "react";

type IconKey = "sunny" | "cloudy" | "rain" | "thunderstorm" | "snow" | "mist" | "default";

const CONDITION_TO_ICON_KEY: Record<string, IconKey> = {
  clear: "sunny",
  sunny: "sunny",
  "partly cloudy": "cloudy",
  cloudy: "cloudy",
  overcast: "cloudy",
  rain: "rain",
  drizzle: "rain",
  "light rain": "rain",
  "heavy rain": "rain",
  thunderstorm: "thunderstorm",
  storm: "thunderstorm",
  snow: "snow",
  sleet: "snow",
  blizzard: "snow",
  mist: "mist",
  fog: "mist",
  haze: "mist",
};

const ICONS: Record<IconKey, ReactElement> = {
  sunny: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="9" fill="#FBBF24" />
      <line x1="24" y1="4" x2="24" y2="10" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="38" x2="24" y2="44" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="4" y1="24" x2="10" y2="24" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="24" x2="44" y2="24" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="9.51" y1="9.51" x2="13.75" y2="13.75" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34.25" y1="34.25" x2="38.49" y2="38.49" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38.49" y1="9.51" x2="34.25" y2="13.75" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="13.75" y1="34.25" x2="9.51" y2="38.49" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  cloudy: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 34H14a8 8 0 0 1-1-15.95A10 10 0 0 1 32 20h1a7 7 0 0 1 3 13.35V34z" fill="#94A3B8" />
    </svg>
  ),
  rain: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 28H14a8 8 0 0 1-1-15.95A10 10 0 0 1 32 14h1a7 7 0 0 1 3 13.35V28z" fill="#94A3B8" />
      <line x1="16" y1="34" x2="14" y2="40" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="34" x2="22" y2="40" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="34" x2="30" y2="40" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  thunderstorm: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 26H14a8 8 0 0 1-1-15.95A10 10 0 0 1 32 12h1a7 7 0 0 1 3 13.35V26z" fill="#64748B" />
      <polyline points="26,28 21,36 25,36 20,44" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 28H14a8 8 0 0 1-1-15.95A10 10 0 0 1 32 14h1a7 7 0 0 1 3 13.35V28z" fill="#CBD5E1" />
      <circle cx="16" cy="36" r="2" fill="#BAE6FD" />
      <circle cx="24" cy="38" r="2" fill="#BAE6FD" />
      <circle cx="32" cy="36" r="2" fill="#BAE6FD" />
    </svg>
  ),
  mist: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="20" x2="38" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="27" x2="34" y2="27" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="34" x2="38" y2="34" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="26" r="3" fill="#FBBF24" />
      <path d="M36 30H20a6 6 0 0 1-1-11.95A8 8 0 0 1 32 20h1a5 5 0 0 1 3 9.65V30z" fill="#94A3B8" />
    </svg>
  ),
};

function resolveIconKey(condition: string): IconKey {
  const normalised = condition.toLowerCase().trim();
  return CONDITION_TO_ICON_KEY[normalised] ?? "default";
}

export default function WeatherIcon({ condition, className = "w-12 h-12" }: WeatherIconProps) {
  const iconKey = resolveIconKey(condition);
  return <span className={className}>{ICONS[iconKey]}</span>;
}