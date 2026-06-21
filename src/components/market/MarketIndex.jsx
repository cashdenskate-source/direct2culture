import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';
import { formatNum } from '../../lib/market.js';
import ChangeBadge from './ChangeBadge.jsx';
import LivePulse from './LivePulse.jsx';

export default function MarketIndex({ title, subtitle, collectionName, valueField, height = 220 }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    (async () => {
      const snap = await getDocs(collection(db, collectionName));
      setRows(snap.docs.map((d) => d.data()));
    })();
  }, [collectionName]);

  const series = useMemo(() => {
    const byDate = new Map();
    for (const r of rows) {
      if (!r.date) continue;
      const v = Number(r[valueField]) || 0;
      byDate.set(r.date, (byDate.get(r.date) || 0) + v);
    }
    return [...byDate.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({ date, total }));
  }, [rows, valueField]);

  const latest = series[series.length - 1]?.total || 0;
  const sevenAgo = series[Math.max(0, series.length - 8)]?.total || latest;
  const change7d = sevenAgo > 0 ? ((latest - sevenAgo) / sevenAgo) * 100 : 0;
  const rising = change7d >= 0;
  const stroke = rising ? '#16a34a' : '#dc2626';

  return (
    <div className="border border-ink p-6 bg-ink text-bone">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">{title}</p>
          <p className="mt-1 font-sans text-3xl lg:text-4xl font-black tracking-tightest">
            <LivePulse value={latest} rate={Math.max(60, latest * 0.001)} />
          </p>
          <div className="mt-1"><ChangeBadge value={change7d} /></div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
          <span className="inline-block h-2 w-2 mr-2 rounded-full bg-green-500 animate-pulse" />
          live · {subtitle}
        </p>
      </div>

      {series.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">building index…</p>
        </div>
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <AreaChart data={series} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
              <defs>
                <linearGradient id="ix" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff15" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#aaa' }} tickFormatter={(d) => d.slice(5)} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#aaa' }} tickFormatter={formatNum} width={50} />
              <Tooltip
                contentStyle={{ background: '#fff', border: 'none', color: '#000', fontFamily: 'monospace', fontSize: 11 }}
                formatter={(v) => [formatNum(v), title]}
              />
              <Area type="monotone" dataKey="total" stroke={stroke} strokeWidth={2} fill="url(#ix)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
