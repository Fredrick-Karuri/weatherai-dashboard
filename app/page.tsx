
import CurrentWeatherCard from './components/server/CurrentWeatherCard';
export default async function Page() {
  const res = await fetch('http://localhost:3000/api/weather?city=London');
  const data = await res.json().catch(() => null);
  return (
    <main>
      <h1>WeatherAI Dashboard</h1>
      <CurrentWeatherCard weather={data} />
    </main>
  );
}
