import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import WatchButton from '../../components/market/WatchButton.jsx';
import LiveNumber from '../../components/market/LiveNumber.jsx';
import { getDJByHandle } from '../../lib/djs.js';
import { subscribeSpinsByDJ } from '../../lib/spins.js';

export default function DJDetail() {
  const { handle } = useParams();
  const [dj, setDj] = useState(null);
  const [spins, setSpins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const d = await getDJByHandle(handle);
      if (!cancelled) { setDj(d); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [handle]);

  useEffect(() => {
    if (!dj?.id) return;
    const unsub = subscribeSpinsByDJ(dj.id, setSpins);
    return () => unsub();
  }, [dj?.id]);

  if (loading) return <Loading />;
  if (!dj) return <NotFound handle={handle} />;

  return (
    <>
      <SEO title={`DJ ${dj.name} · @${dj.handle} | Culture Stock Exchange`} description={`${dj.name} — DJ profile, recent spins, top songs, venues.`} />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow={`DJ / @${dj.handle}`}
          title={`${dj.name}${dj.verified ? ' ✓' : ''}.`}
          kicker={
            <>
              {dj.city || 'no city'}
              {dj.genres?.length ? ` · ${dj.genres.join(', ')}` : ''}
              {dj.venues?.length ? ` · plays ${dj.venues.slice(0, 3).join(', ')}` : ''}
            </>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WatchButton kind="dj" id={dj.id} ticker={dj.handle} title={dj.name} subtitle={dj.city} imageURL={dj.photoURL} href={`/market/dj/${dj.handle}`} />
          {dj.instagramURL && (
            <a href={dj.instagramURL} target="_blank" rel="noopener noreferrer" className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">Instagram →</a>
          )}
          {dj.soundcloudURL && (
            <a href={dj.soundcloudURL} target="_blank" rel="noopener noreferrer" className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">SoundCloud →</a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
          <Stat label="Total Spins" value={<LiveNumber value={dj.totalSpins || 0} />} />
          <Stat label="Influence Score" value={<LiveNumber value={dj.influenceScore || 0} />} />
          <Stat label="Culture Score" value={<LiveNumber value={dj.cultureScore || 0} />} />
          <Stat label="Verified" value={dj.verified ? '✓ Yes' : '—'} />
        </div>

        {dj.bio && (
          <div className="mt-10 border border-ink/10 p-6">
            <p className="eyebrow">About</p>
            <p className="mt-3 text-ink/85 leading-relaxed max-w-3xl">{dj.bio}</p>
          </div>
        )}

        <div className="mt-10">
          <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
            <h2 className="font-sans text-2xl font-black tracking-tight">Recent spins</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{spins.length} logged</p>
          </div>
          {spins.length === 0 ? (
            <p className="py-6 text-ink/60">No spins logged yet.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {spins.map((s) => (
                <li key={s.id} className="py-3 grid grid-cols-12 gap-3 items-center">
                  <p className="col-span-12 sm:col-span-5 font-sans font-bold tracking-tight truncate">
                    {s.songTicker && <>${s.songTicker} · </>}{s.songTitle}
                    {s.artistName && <span className="text-ash font-normal"> · {s.artistName}</span>}
                  </p>
                  <p className="col-span-6 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                    {s.venue || '—'}{s.city ? ` · ${s.city}` : ''}
                  </p>
                  <p className="col-span-6 sm:col-span-3 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                    {formatDate(s.spunAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <Link to="/market/djs" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← Back to DJ Market</Link>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-ink/10 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-2 font-sans text-3xl font-black tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function formatDate(ts) {
  if (!ts) return '—';
  try { const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  catch { return '—'; }
}

function Loading() { return <div className="container-edge py-24"><p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Loading…</p></div>; }
function NotFound({ handle }) {
  return (
    <div className="container-edge py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">DJ not found</p>
      <h2 className="mt-3 font-sans text-3xl font-black">@{handle}</h2>
      <Link to="/market/djs" className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">← Back to DJ Market</Link>
    </div>
  );
}
