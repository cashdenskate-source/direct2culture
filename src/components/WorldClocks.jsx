import { useEffect, useState } from 'react';

const CITIES = [
  { label: 'ATL', tz: 'America/New_York' },
  { label: 'NYC', tz: 'America/New_York' },
  { label: 'MIA', tz: 'America/New_York' },
  { label: 'LA',  tz: 'America/Los_Angeles' },
  { label: 'SHA', tz: 'Asia/Shanghai' },
];

const TIME_FMT = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: '2-digit', hour12: true,
});

function formatFor(tz) {
  try {
    const f = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz,
    });
    return f.format(new Date()).replace(/\s/g, '').toLowerCase();
  } catch {
    return TIME_FMT.format(new Date()).replace(/\s/g, '').toLowerCase();
  }
}

export default function WorldClocks() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-ink/10 bg-bone">
      <div className="container-edge flex items-center gap-5 lg:gap-7 overflow-x-auto py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash shrink-0">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-2 align-middle" />
          Live
        </p>
        {CITIES.map((c) => (
          <div key={c.label} className="flex items-baseline gap-2 shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{c.label}</span>
            <span className="font-mono text-[11px] tabular-nums text-ink">{formatFor(c.tz)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
