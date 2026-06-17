
export async function geocodeCity(q: string) {
  // supports "lat,lon" passthrough
  if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(q)) {
    const [lat, lon] = q.split(',').map(Number);
    return { lat, lon, name: `${lat},${lon}` };
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`;
  const res = await fetch(url, { headers: { 'User-Agent': process.env.OPEN_METEO_USER_AGENT || 'weatherai-dashboard' } });
  const data = await res.json().catch(() => null);
  const first = data?.results?.[0];
  if (!first) return null;
  return { lat: first.latitude, lon: first.longitude, name: first.name };
}
