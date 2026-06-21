import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import StockChart from '../../components/market/StockChart.jsx';
import ChangeBadge from '../../components/market/ChangeBadge.jsx';
import LiveNumber from '../../components/market/LiveNumber.jsx';
import WatchButton from '../../components/market/WatchButton.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';
import { getSongByTicker, formatNum, trendStatus } from '../../lib/market.js';

export default function SongDetail() {
  const { ticker } = useParams();
  const [song, setSong] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load to resolve ticker → id
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const s = await getSongByTicker(ticker);
      if (!cancelled) {
        setSong(s);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ticker]);

  // Live subscribe to song doc once we know its id
  useEffect(() => {
    if (!song?.id || !hasFirebaseConfig || !db) return;
    const unsub = onSnapshot(doc(db, 'songs', song.id), (snap) => {
      if (snap.exists()) setSong({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [song?.id]);

  // Live subscribe to stream history
  useEffect(() => {
    if (!song?.id || !hasFirebaseConfig || !db) return;
    const q = query(
      collection(db, 'streamHistory'),
      where('songId', '==', song.id),
      orderBy('date', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [song?.id]);

  if (loading) return <Loading />;
  if (!song) return <NotFound ticker={ticker} />;

  const trend = trendStatus(song.change7d || 0);

  return (
    <>
      <SEO title={`$${song.ticker} · ${song.title} | Culture Stock Exchange`} description={`${song.title} by ${song.artistName} — ${formatNum(song.totalStreams)} total streams.`} />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow={`Song / $${song.ticker}`}
          title={song.title + '.'}
          kicker={
            <>
              by <Link to={`/market/artist/${song.artistTicker || ''}`} className="text-ink hover:underline">{song.artistName}</Link>
              {song.genre ? ` · ${song.genre}` : ''}
              {song.releaseDate ? ` · released ${song.releaseDate}` : ''}
            </>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WatchButton
            kind="song"
            id={song.id}
            ticker={song.ticker}
            title={song.title}
            subtitle={song.artistName}
            imageURL={song.coverURL}
            href={`/market/song/${song.ticker}`}
          />
        </div>
        <StreamingLinks song={song} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
          <Stat label="Total Streams" value={<LiveNumber value={Number(song.totalStreams) || 0} />} />
          <Stat label="Today" value={<LiveNumber value={Number(song.streamsToday) || 0} />} />
          <Stat label="7-Day" badge={<ChangeBadge value={song.change7d} />} />
          <Stat label="30-Day" badge={<ChangeBadge value={song.change30d} />} />
        </div>

        <PlatformBreakdown song={song} />

        <div className="mt-10 border border-ink/10 p-6">
          <div className="flex items-end justify-between border-b border-ink pb-3 mb-4">
            <h2 className="font-sans text-2xl font-black tracking-tight">Stream history</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              <span className="inline-block h-2 w-2 mr-2 rounded-full bg-green-500 animate-pulse" />
              live · trend: {trend}
            </p>
          </div>
          <StockChart data={history} height={320} pulse />
        </div>

        <div className="mt-8 flex gap-3">
          <Link to="/market" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
            ← Back to Market
          </Link>
        </div>
      </div>
    </>
  );
}

function StreamingLinks({ song }) {
  const links = [
    { label: 'Spotify', url: song.spotifyURL },
    { label: 'Apple Music', url: song.appleMusicURL },
    { label: 'YouTube', url: song.youtubeURL },
    { label: 'SoundCloud', url: song.soundcloudURL },
    { label: 'Audiomack', url: song.audiomackURL },
  ].filter((l) => l.url);
  if (!links.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
        >
          {l.label} →
        </a>
      ))}
    </div>
  );
}

function PlatformBreakdown({ song }) {
  const rows = [
    { label: 'Spotify', value: song.spotifyStreams },
    { label: 'Apple Music', value: song.appleStreams },
    { label: 'YouTube', value: song.youtubeViews },
    { label: 'SoundCloud', value: song.soundcloudPlays },
    { label: 'Audiomack', value: song.audiomackPlays },
  ].filter((r) => r.value != null && r.value !== '');
  if (!rows.length) return null;
  return (
    <div className="mt-6 border border-ink/10 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Platform breakdown</p>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{r.label}</p>
            <p className="mt-1 font-sans text-xl font-black tabular-nums">
              <LiveNumber value={Number(r.value) || 0} />
            </p>
          </div>
        ))}
      </div>
    </div>
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

function Loading() {
  return (
    <div className="container-edge py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Loading ticker…</p>
    </div>
  );
}

function NotFound({ ticker }) {
  return (
    <div className="container-edge py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Ticker not found</p>
      <h2 className="mt-3 font-sans text-3xl font-black">${ticker?.toUpperCase()}</h2>
      <Link to="/market" className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
        ← Back to Market
      </Link>
    </div>
  );
}
