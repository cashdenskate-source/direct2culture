import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import SongCard from '../../components/market/SongCard.jsx';
import ChangeBadge from '../../components/market/ChangeBadge.jsx';
import { getArtistByTicker, getSongsByArtist, formatNum } from '../../lib/market.js';

export default function ArtistDetail() {
  const { ticker } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const a = await getArtistByTicker(ticker);
      if (cancelled) return;
      setArtist(a);
      if (a) {
        const s = await getSongsByArtist(a.id);
        if (!cancelled) setSongs(s);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [ticker]);

  if (loading) {
    return (
      <div className="container-edge py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Loading…</p>
      </div>
    );
  }
  if (!artist) {
    return (
      <div className="container-edge py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Artist not found</p>
        <Link to="/market" className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
          ← Back to Market
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={`$${artist.ticker} · ${artist.name} | Culture Stock Exchange`} description={`${artist.name} on the Culture Stock Exchange — ${formatNum(artist.monthlyListeners)} monthly listeners.`} />
      <div className="container-edge py-12 lg:py-16">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
            {artist.photoURL ? (
              <img src={artist.photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-sm uppercase tracking-[0.2em] text-ash">
                {artist.ticker?.slice(0, 2)}
              </div>
            )}
          </div>
          <PageHeader
            eyebrow={`Artist / $${artist.ticker}`}
            title={artist.name + '.'}
            kicker={artist.bio || 'Independent artist.'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <Stat label="Monthly Listeners" value={formatNum(artist.monthlyListeners)} />
          <Stat label="Total Streams" value={formatNum(artist.totalStreams)} />
          <Stat label="Fan Growth" badge={<ChangeBadge value={artist.fanGrowthPct} />} />
          <Stat label="Trend Score" value={String(artist.trendScore || 0)} />
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
            <h2 className="font-sans text-2xl font-black tracking-tight">Catalog</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{songs.length} songs</p>
          </div>
          {songs.length === 0 ? (
            <p className="text-ink/60 py-6">No songs yet.</p>
          ) : (
            songs.map((s, i) => <SongCard key={s.id} song={s} rank={i + 1} />)
          )}
        </div>

        <Link to="/market" className="mt-8 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
          ← Back to Market
        </Link>
      </div>
    </>
  );
}

function Stat({ label, value, badge }) {
  return (
    <div className="border border-ink/10 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-2 font-sans text-3xl font-black tracking-tight tabular-nums">
        {value || badge}
      </p>
    </div>
  );
}
