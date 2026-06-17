"use client";

/**
 * app/error.tsx
 *
 * Next.js error boundary. Catches weather fetch failures and displays
 * a friendly message with retry and home fallback options.
 * "Try again" re-runs the server component; "Go home" navigates to
 * default location so the user is never fully stuck.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("[ErrorBoundary]", error.message);
  }, [error]);

  function handleGoHome() {
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-8">
      <div className="text-center text-white max-w-sm">
        <p className="text-5xl mb-4">⛈</p>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-white/60 text-sm mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition"
          >
            Try again
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition"
          >
            Go home
          </button>
        </div>
      </div>
    </main>
  );
}