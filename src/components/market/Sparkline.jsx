import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';

export default function Sparkline({ songId, width = 110, height = 28, color }) {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (!songId || !hasFirebaseConfig || !db) return;
    const q = query(
      collection(db, 'streamHistory'),
      where('songId', '==', songId),
      orderBy('date', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setPoints(snap.docs.map((d) => Number(d.data().streams) || 0));
    });
    return () => unsub();
  }, [songId]);

  if (!points.length) {
    return <div className="text-ash font-mono text-[9px] uppercase tracking-[0.25em]">no data</div>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = points.length > 1 ? width / (points.length - 1) : 0;
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const stroke = color || (points[points.length - 1] >= points[0] ? '#16a34a' : '#dc2626');

  return (
    <svg width={width} height={height} className="block">
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
      <circle
        cx={(points.length - 1) * step}
        cy={height - ((points[points.length - 1] - min) / range) * (height - 4) - 2}
        r={2}
        fill={stroke}
      >
        <animate attributeName="r" from="2" to="5" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0.2" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
