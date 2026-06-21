import { useEffect, useRef, useState } from 'react';
import { formatNum } from '../../lib/market.js';

export default function LiveNumber({ value, format = formatNum, duration = 600 }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(performance.now());

  useEffect(() => {
    fromRef.current = display;
    startRef.current = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span>{format(Math.round(display))}</span>;
}
