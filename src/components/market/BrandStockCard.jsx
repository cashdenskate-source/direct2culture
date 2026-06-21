import { Link } from 'react-router-dom';
import ChangeBadge from './ChangeBadge.jsx';
import { formatNum } from '../../lib/market.js';

export default function BrandStockCard({ brand, rank }) {
  return (
    <Link
      to={`/market/brand/${brand.ticker}`}
      className="group flex items-center gap-4 border-b border-ink/10 py-4 hover:bg-ink/5 transition-colors px-2 -mx-2"
    >
      {rank != null && (
        <p className="w-8 font-mono text-[11px] text-ash tabular-nums">{String(rank).padStart(2, '0')}</p>
      )}
      <div className="h-12 w-12 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
        {brand.logoURL ? (
          <img src={brand.logoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {brand.ticker?.slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold tracking-tight truncate group-hover:underline">
          ${brand.ticker} <span className="text-ash font-normal">· {brand.name}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
          {brand.category || 'streetwear'}{brand.hq ? ` · ${brand.hq}` : ''}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-sans font-bold tabular-nums">{formatNum((brand.followersIG || 0) + (brand.followersTT || 0))}</p>
        <ChangeBadge value={brand.growthPct} />
      </div>
    </Link>
  );
}
