"use client";

/**
 * app/components/client/WeatherShell.tsx
 *
 * Client component. Owns the search state and triggers weather re-fetches
 * when the user searches a new city. Updates URL search params so the
 * last city survives a page reload. Tracks navigation pending state
 * separately from geolocation so neither blocks the other.
 */

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import { GeocodeResult } from "@/app/lib/types";

interface WeatherShellProps {
  children: React.ReactNode;
}

export default function WeatherShell({ children }: WeatherShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  // Mirror isPending into isNavigating so SearchBar stays unblocked
  // once the transition settles, regardless of how long the page fetch takes.
  useEffect(() => {
    if (!isPending) setIsNavigating(false);
  }, [isPending]);

  function handleSearch(result: GeocodeResult) {
    setIsNavigating(true);
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("lat", String(result.lat));
      params.set("lon", String(result.lon));
      params.set("city", result.displayName);
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} isLoading={isNavigating} />
      {isNavigating ? <WeatherSkeleton /> : children}
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 rounded-2xl bg-white/10" />
      <div className="h-32 rounded-2xl bg-white/10" />
    </div>
  );
}