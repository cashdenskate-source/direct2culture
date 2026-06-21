import { useEffect, useState } from 'react';

export default function Countdown({ to, onComplete }) {
  const target = to?.toDate ? to.toDate().getTime() : new Date(to).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const done = diff <= 0;

  useEffect(() => {
    if (done && onComplete) onComplete();
  }, [done, onComplete]);

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  if (done) {
    return <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green-600">Out now</span>;
  }

  return (
    <div className="flex items-baseline gap-3 tabular-nums font-mono">
      <Unit value={d} label="d" />
      <Unit value={h} label="h" />
      <Unit value={m} label="m" />
      <Unit value={s} label="s" />
    </div>
  );
}

function Unit({ value, label }) {
  return (
    <span>
      <span className="font-sans text-2xl font-black">{String(value).padStart(2, '0')}</span>
      <span className="ml-1 text-[10px] uppercase tracking-[0.25em] opacity-60">{label}</span>
    </span>
  );
}
