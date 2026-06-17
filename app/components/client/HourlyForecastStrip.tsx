
'use client';
import { useRef } from 'react';

export default function HourlyForecastStrip({ hours }: { hours: any[] }) {
  const el = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={el} style={{ overflowX: 'auto', display: 'flex', gap: 8 }}>
      {hours?.map((h, i) => (
        <div key={i} style={{ minWidth: 80 }}>
          <div>{h.time}</div>
          <div>{h.temp}°</div>
        </div>
      ))}
    </div>
  );
}
