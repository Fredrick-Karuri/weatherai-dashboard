
export default function WeatherIcon({ condition }: { condition: string }) {
  if (condition.includes('rain')) {
    return <svg width="48" height="48"><circle cx="24" cy="24" r="20" fill="#7fbfff"/></svg>;
  }
  return <svg width="48" height="48"><circle cx="24" cy="24" r="20" fill="#ffd86b"/></svg>;
}
