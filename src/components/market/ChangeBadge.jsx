export default function ChangeBadge({ value, suffix = '%' }) {
  const v = Number(value || 0);
  const cls = v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : 'text-ash';
  const arrow = v > 0 ? '▲' : v < 0 ? '▼' : '·';
  return (
    <span className={`font-mono text-[11px] tracking-tight ${cls}`}>
      {arrow} {v > 0 ? '+' : ''}{v.toFixed(1)}{suffix}
    </span>
  );
}
