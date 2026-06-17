"use client";

/**
 * app/components/client/WeatherShell.tsx
 *
 * Client component. Owns the search state and triggers weather re-fetches
 * when the user searches a new city. Updates URL search params so the
 * last city survives a page reload. Tracks navigation pending state
 * separately from geolocation so neither blocks the other.
 */

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import { GeocodeResult } from "@/app/lib/types";

interface WeatherShellProps {
  children: React.ReactNode;
}

export default function WeatherShell({ children }: WeatherShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSearch(result: GeocodeResult) {
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
      <SearchBar onSearch={handleSearch} isLoading={isPending} />
      {isPending ? <WeatherSkeleton /> : children}
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