import { useEffect, useState } from 'react';

function compute(targetMs) {
  const diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: diff === 0, diff };
}

// Ticks every second until the target moment, then stops.
export function useCountdown(target) {
  const targetMs = target ? new Date(target).getTime() : null;
  const [state, setState] = useState(() =>
    targetMs ? compute(targetMs) : { days: 0, hours: 0, minutes: 0, seconds: 0, done: true, diff: 0 }
  );
  useEffect(() => {
    if (!targetMs) return;
    setState(compute(targetMs));
    const id = setInterval(() => {
      const next = compute(targetMs);
      setState(next);
      if (next.done) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return state;
}

export function pad(n) {
  return String(n).padStart(2, '0');
}

// Single source of truth for "is this drop still locked, and what status should we show?"
// Used by DropCard for rendering and by the Drops page for filter buckets.
export function effectiveDropStatus(drop, now = Date.now()) {
  if (!drop) return 'upcoming';
  if (drop.status === 'sold out') return 'sold out';
  if (!drop.releaseAt) return drop.status || 'upcoming';
  const releaseMs = new Date(drop.releaseAt).getTime();
  if (now < releaseMs) return 'upcoming';
  if (drop.status === 'upcoming') return 'live';
  return drop.status;
}
