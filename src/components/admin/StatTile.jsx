import { Link } from 'react-router-dom';
import LivePulse from '../market/LivePulse.jsx';
import ChangeBadge from '../market/ChangeBadge.jsx';

export default function StatTile({ label, value, delta, to, accent, rate = 0 }) {
  const inner = (
    <div className={`border p-5 transition-colors ${
      accent ? 'bg-ink text-bone border-ink' : 'border-ink/15 bg-bone hover:border-ink'
    }`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${accent ? 'text-bone/60' : 'text-ash'}`}>
        {label}
      </p>
      <p className="mt-3 font-sans text-3xl lg:text-4xl font-black tracking-tightest leading-none tabular-nums">
        <LivePulse value={Number(value) || 0} rate={rate} intervalMs={2400} format={(n) => n.toLocaleString()} />
      </p>
      {delta != null && (
        <div className="mt-2"><ChangeBadge value={delta} /></div>
      )}
    </div>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : inner;
}
