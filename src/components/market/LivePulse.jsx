import { useEffect, useRef, useState } from 'react';
import { formatNum } from '../../lib/market.js';

// Visually "alive" number: ticks subtly up/down every few seconds.
// Resets to `value` whenever the prop changes (from Firestore).
// rate = expected change per minute (used to scale the random wiggle).
export default function LivePulse({ value, rate = 0, format = formatNum, intervalMs = 2000 }) {
  const [display, setDisplay] = useState(Number(value) || 0);
  const [flash, setFlash] = useState(null); // 'up' | 'down' | null
  const baselineRef = useRef(Number(value) || 0);

  useEffect(() => {
    baselineRef.current = Number(value) || 0;
    setDisplay(Number(value) || 0);
  }, [value]);

  useEffect(() => {
    const id = setInterval(() => {
      const v = baselineRef.current;
      // wiggle magnitude: ~rate/30 per tick, with random sign biased upward
      const base = Math.max(1, rate / 30);
      const delta = Math.round((Math.random() * 2 - 0.8) * base);
      const next = Math.max(0, v + delta);
      setFlash(delta >= 0 ? 'up' : 'down');
      setDisplay(next);
      baselineRef.current = next;
      const t = setTimeout(() => setFlash(null), 350);
      return () => clearTimeout(t);
    }, intervalMs);
    return () => clearInterval(id);
  }, [rate, intervalMs]);

  const cls = flash === 'up' ? 'text-green-600' : flash === 'down' ? 'text-red-600' : '';
  return <span className={`transition-colors duration-300 ${cls}`}>{format(Math.round(display))}</span>;
}
