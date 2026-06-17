# WeatherAI Dashboard

Real-time weather forecasts with AI-generated summaries, built with Next.js 14 and the [WeatherAI API](https://weather-ai.co).

**Live demo:** _[add your Vercel URL here]_

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
   Get a free key at [weather-ai.co/dashboard](https://weather-ai.co/dashboard).

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

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add `WEATHERAI_API_KEY` and `NEXT_PUBLIC_APP_URL` under **Project → Settings → Environment Variables**.
4. Deploy.

## Project Structure

```
weatherai-dashboard/
  app/
    page.tsx                      # Server root: fetches weather, composes layout
    api/
      weather/route.ts            # Proxy: GET /v1/weather (keeps key server-side)
      hourly/route.ts             # Proxy: GET /v1/hourly
    components/
      server/
        CurrentWeatherCard.tsx    # Conditions + AI summary display
        WeatherIcon.tsx           # Condition string → inline SVG
      client/
        SearchBar.tsx             # City input + geolocation
        HourlyForecastStrip.tsx   # Scrollable 24h forecast
        WeatherShell.tsx          # Search state + URL param sync
    lib/
      weatherai.ts                # Typed fetch helpers
      geocode.ts                  # City → lat/lon via Open-Meteo
      types.ts                    # Shared TypeScript interfaces
```

## Available Commands

```bash
make dev     # Start development server
make build   # Production build
make lint    # Run ESLint
```