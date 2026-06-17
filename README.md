# WeatherAI Dashboard

Real-time weather forecasts with AI-generated summaries, built with Next.js 14 and the [WeatherAI API](https://weather-ai.co).

**Live demo:** _https://app-nimbus.vercel.app/_

---

## Features

- Current conditions: temperature, humidity, wind speed, condition
- AI-generated weather summary from WeatherAI
- 24-hour hourly forecast strip
- City search with geocoding (via Open-Meteo — no extra key needed)
- One-click geolocation
- URL-based state — last city survives a reload

## Getting Started

**Prerequisites:** Node.js 20+

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/your-username/weatherai-dashboard.git
   cd weatherai-dashboard
   npm install
   ```

2. Copy the env example and add your API key:
   ```bash
   cp .env.example .env.local
   ```
   Get a free key at [weather-ai.co](https://weather-ai.co).

3. Start the dev server:
   ```bash
   make dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable               | Required | Description                                     |
|------------------------|----------|-------------------------------------------------|
| `WEATHERAI_API_KEY`    | Yes      | Your WeatherAI API key (prefix: `wai_`)         |
| `NEXT_PUBLIC_APP_URL`  | Yes      | App base URL (default: `http://localhost:3000`) |

## Project Structure

```
weatherai-dashboard/
  app/
    page.tsx                          # Server root: fetches weather, composes layout
    layout.tsx                        # Root layout
    loading.tsx                       # Suspense loading UI
    error.tsx                         # Error boundary UI
    globals.css
    api/
      weather/route.ts                # Proxy: GET /v1/weather (keeps key server-side)
      hourly/route.ts                 # Proxy: GET /v1/hourly
    components/
      server/
        CurrentWeatherCard.tsx        # Conditions + AI summary display
        WeatherIcon.tsx               # Condition string → inline SVG
      client/
        SearchBar.tsx                 # City input + geolocation
        HourlyForecastStrip.tsx       # Scrollable 24h forecast
        WeatherShell.tsx              # Search state + URL param sync
    lib/
      config.ts                       # App-wide constants and env vars
      geocode.ts                      # City → lat/lon via Open-Meteo
      logger.ts                       # Structured logger
      types.ts                        # Shared TypeScript interfaces
      providers/
        index.ts                      # Provider factory
        types.ts                      # IWeatherProvider interface
        openmeteo.ts                  # Open-Meteo provider (no key required)
        weatherai.ts                  # WeatherAI provider (requires API key)
    __tests__/
      lib/
        providers/
          openmeteo.test.ts
```

## Available Commands

```bash
make dev     # Start development server
make build   # Production build
make lint    # Run ESLint
make test    # Run tests
```