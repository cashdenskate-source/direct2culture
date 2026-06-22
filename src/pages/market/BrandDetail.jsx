import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import StockChart from '../../components/market/StockChart.jsx';
import ChangeBadge from '../../components/market/ChangeBadge.jsx';
import LiveNumber from '../../components/market/LiveNumber.jsx';
import WatchButton from '../../components/market/WatchButton.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';
import { getBrandByTicker, subscribeBrandHistory } from '../../lib/brands.js';
import { formatNum } from '../../lib/market.js';

export default function BrandDetail() {
  const { ticker } = useParams();
  const [brand, setBrand] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const b = await getBrandByTicker(ticker);
      if (!cancelled) { setBrand(b); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [ticker]);

  useEffect(() => {
    if (!brand?.id || !hasFirebaseConfig || !db) return;
    const unsub = onSnapshot(doc(db, 'brands', brand.id), (snap) => {
      if (snap.exists()) setBrand({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [brand?.id]);

  useEffect(() => {
    if (!brand?.id) return;
    const unsub = subscribeBrandHistory(brand.id, setHistory);
    return () => unsub();
  }, [brand?.id]);

  if (loading) return <Loading />;
  if (!brand) return <NotFound ticker={ticker} />;

  const totalFollowers = (brand.followersIG || 0) + (brand.followersTT || 0);

  return (
    <>
      <SEO title={`$${brand.ticker} · ${brand.name} | Brand Stock Exchange`} description={`${brand.name} — ${formatNum(totalFollowers)} followers across IG + TikTok.`} />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow={`Brand / $${brand.ticker}`}
          title={brand.name + '.'}
          kicker={
            <>
              {brand.category || 'Streetwear'}{brand.hq ? ` · based in ${brand.hq}` : ''}{brand.founded ? ` · est. ${brand.founded}` : ''}
            </>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WatchButton
            kind="brand"
            id={brand.id}
            ticker={brand.ticker}
            title={brand.name}
            subtitle={brand.category || 'brand'}
            imageURL={brand.logoURL}
            href={`/market/brand/${brand.ticker}`}
          />
        </div>
        <SocialLinks brand={brand} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
          <Stat label="Total Followers" value={<LiveNumber value={totalFollowers} />} />
          <Stat label="Instagram" value={<LiveNumber value={brand.followersIG || 0} />} />
          <Stat label="TikTok" value={<LiveNumber value={brand.followersTT || 0} />} />
          <Stat label="Growth" badge={<ChangeBadge value={brand.growthPct} />} />
        </div>

        {brand.bio && (
          <div className="mt-10 border border-ink/10 p-6">
            <p className="eyebrow">About</p>
            <p className="mt-3 text-ink/85 leading-relaxed max-w-3xl">{brand.bio}</p>
          </div>
        )}

        <div className="mt-10 border border-ink/10 p-6">
          <div className="flex items-end justify-between border-b border-ink pb-3 mb-4">
            <h2 className="font-sans text-2xl font-black tracking-tight">Follower history</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              <span className="inline-block h-2 w-2 mr-2 rounded-full bg-green-500 animate-pulse" />
              live
            </p>
          </div>
          <StockChart data={history} height={320} pulse />
        </div>

        <div className="mt-8 flex gap-3">
          <Link to="/market/brands" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
            ← Back to Brands
          </Link>
        </div>
      </div>
    </>
  );
}

function SocialLinks({ brand }) {
  const links = [
    { label: 'Store', url: brand.storeURL },
    { label: 'Instagram', url: brand.instagramURL },
    { label: 'TikTok', url: brand.tiktokURL },
    { label: 'Website', url: brand.websiteURL },
  ].filter((l) => l.url);
  const apps = [
    { label: 'Apple App Store', url: brand.iosAppURL },
    { label: 'Google Play', url: brand.androidAppURL },
  ].filter((l) => l.url);
  if (!links.length && !apps.length) return null;
  return (
    <div className="mt-6 space-y-4">
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
              {l.label} →
            </a>
          ))}
        </div>
      )}
      {apps.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Get the App</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {apps.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                className="border border-ink bg-ink text-bone px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity">
                {l.label} ↓
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, badge }) {
  return (
    <div className="border border-ink/10 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-2 font-sans text-3xl font-black tracking-tight tabular-nums">{value || badge}</p>
    </div>
  );
}

function Loading() {
  return <div className="container-edge py-24"><p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Loading ticker…</p></div>;
}
function NotFound({ ticker }) {
  return (
    <div className="container-edge py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Ticker not found</p>
      <h2 className="mt-3 font-sans text-3xl font-black">${ticker?.toUpperCase()}</h2>
      <Link to="/market/brands" className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">← Back to Brands</Link>
    </div>
  );
}
