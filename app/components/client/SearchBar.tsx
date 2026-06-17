
'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('');
  return (
    <div>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="City name" />
      <button onClick={() => onSearch(q)}>Search</button>
      <button onClick={() => {
        navigator.geolocation.getCurrentPosition(pos => {
          onSearch(`${pos.coords.latitude},${pos.coords.longitude}`);
        });
      }}>Use my location</button>
    </div>
  );
}
