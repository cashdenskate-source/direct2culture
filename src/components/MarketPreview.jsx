import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeSongs, formatNum } from '../lib/market.js';
import { subscribeBrands } from '../lib/brands.js';
import { subscribeDJs } from '../lib/djs.js';
import LivePulse from './market/LivePulse.jsx';
import ChangeBadge from './market/ChangeBadge.jsx';

export default function MarketPreview() {
  const [songs, setSongs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [djs, setDjs] = useState([]);

  useEffect(() => {
    const u1 = subscribeSongs(setSongs);
    const u2 = subscribeBrands(setBrands);
    const u3 = subscribeDJs(setDjs);
    return () => { u1(); u2(); u3(); };
  }, []);

  const topSongs = [...songs].sort((a, b) => (b.totalStreams || 0) - (a.totalStreams || 0)).slice(0, 4);
  const topBrands = [...brands].sort((a, b) => ((b.followersIG || 0) + (b.followersTT || 0)) - ((a.followersIG || 0) + (a.followersTT || 0))).slice(0, 4);
  const topDJs = [...djs].sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0)).slice(0, 4);

  return (
    <section className="border-b border-ink/10 bg-bone">
      <div className="container-edge py-20 lg:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-ink pb-4">
          <div>
            <p className="eyebrow">06 / Culture Stock Exchange</p>
            <h2 className="display-lg mt-4">Tickers, live.</h2>
            <p className="mt-4 max-w-2xl text-ink/75 text-lg">
              Track music, brands, DJs, and creatives like assets. Real numbers, live charts, public.
            </p>
          </div>
          <Link to="/market" className="btn-primary">Open Market →</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <Col title="Top Music" link="/market" emptyMsg="No songs yet">
            {topSongs.map((s) => (
              <Row key={s.id} to={`/market/song/${s.ticker}`} ticker={s.ticker} title={s.title} subtitle={s.artistName}
                   value={<LiveNumber n={s.totalStreams} rate={Math.max(30, (s.streamsToday || 80) * 0.6)} />}
                   change={s.change7d} />
            ))}
          </Col>
          <Col title="Top Brands" link="/market/brands" emptyMsg="No brands yet">
            {topBrands.map((b) => (
              <Row key={b.id} to={`/market/brand/${b.ticker}`} ticker={b.ticker} title={b.name} subtitle={b.category}
                   value={<LiveNumber n={(b.followersIG || 0) + (b.followersTT || 0)} rate={Math.max(15, ((b.followersIG || 0) + (b.followersTT || 0)) * 0.002)} />}
                   change={b.growthPct} />
            ))}
          </Col>
          <Col title="Top DJs" link="/market/djs" emptyMsg="No DJs yet">
            {topDJs.map((d) => (
              <Row key={d.id} to={`/market/dj/${d.handle}`} ticker={d.handle} title={d.name} subtitle={d.city}
                   value={<LiveNumber n={d.totalSpins} rate={5} />}
                   change={null} />
            ))}
          </Col>
        </div>
      </div>
    </section>
  );
}

function Col({ title, link, children, emptyMsg }) {
  const empty = !children || (Array.isArray(children) && children.length === 0);
  return (
    <div>
      <div className="flex items-end justify-between border-b border-ink/10 pb-2 mb-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink font-bold">{title}</p>
        <Link to={link} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">View →</Link>
      </div>
      {empty ? <p className="py-4 text-ink/60 text-sm">{emptyMsg}</p> : children}
    </div>
  );
}

function Row({ to, ticker, title, subtitle, value, change }) {
  return (
    <Link to={to} className="grid grid-cols-12 gap-2 items-center py-2.5 border-b border-ink/5 hover:bg-ink/5 -mx-1 px-1 transition-colors">
      <div className="col-span-7 min-w-0">
        <p className="font-sans font-bold text-sm tracking-tight truncate">${ticker}</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash truncate">{title}{subtitle ? ` · ${subtitle}` : ''}</p>
      </div>
      <p className="col-span-3 text-right font-sans font-bold text-sm tabular-nums">{value}</p>
      <div className="col-span-2 text-right">{change != null && <ChangeBadge value={change} />}</div>
    </Link>
  );
}

function LiveNumber({ n, rate }) {
  return <LivePulse value={Number(n) || 0} rate={rate} intervalMs={2400} format={(x) => formatNum(x)} />;
}
