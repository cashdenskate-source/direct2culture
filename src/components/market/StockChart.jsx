import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatNum } from '../../lib/market.js';

function PulseDot({ cx, cy, color }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill={color} />
      <circle cx={cx} cy={cy} r={4} fill={color} opacity={0.4}>
        <animate attributeName="r" from="4" to="14" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export default function StockChart({ data = [], height = 220, color, pulse = false }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center border border-ink/10 bg-ink/[0.02]" style={{ height }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">no data yet</p>
      </div>
    );
  }
  const first = data[0]?.streams || 0;
  const last = data[data.length - 1]?.streams || 0;
  const stroke = color || (last >= first ? '#16a34a' : '#dc2626');
  const lastIdx = data.length - 1;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#00000010" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#999' }}
            tickFormatter={(d) => d.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10, fill: '#999' }} tickFormatter={formatNum} width={50} />
          <Tooltip
            contentStyle={{ background: '#000', border: 'none', color: '#fff', fontFamily: 'monospace', fontSize: 11 }}
            labelStyle={{ color: '#aaa' }}
            formatter={(v) => [formatNum(v), 'Streams']}
          />
          <Line
            type="monotone"
            dataKey="streams"
            stroke={stroke}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={800}
            dot={pulse ? (props) => (props.index === lastIdx ? <PulseDot key={props.index} {...props} color={stroke} /> : null) : false}
            activeDot={{ r: 5, fill: stroke }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
