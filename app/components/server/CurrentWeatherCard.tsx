# filepath: /Users/fredrickkaruri/Dev/weatherai-dashboard/app/components/server/CurrentWeatherCard.tsx
import WeatherIcon from './WeatherIcon';

export default function CurrentWeatherCard({ weather }: { weather: any }) {
  if (!weather) return <div>No data</div>;
  return (
    <section>
      <WeatherIcon condition={weather.condition || 'clear'} />
      <div>
        <h2>{weather.location || 'Unknown'}</h2>
        <p>{weather.temp_c ?? weather.temp ?? '—'}°</p>
        <p>{weather.summary || weather.condition_text || ''}</p>
      </div>
    </section>
  );
}
