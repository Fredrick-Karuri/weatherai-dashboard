/**
 * loading.tsx
 *
 * Next.js loading UI. Shown during server-side data fetching.
 */

export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-xl mx-auto animate-pulse">
        <div className="mb-8">
          <div className="h-7 w-32 bg-white/20 rounded-lg" />
          <div className="h-4 w-48 bg-white/10 rounded-lg mt-2" />
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-white/10 rounded-xl" />
          <div className="h-52 bg-white/10 rounded-2xl" />
          <div className="h-36 bg-white/10 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}