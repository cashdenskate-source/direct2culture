import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import SongCard from '../../components/market/SongCard.jsx';
import ArtistCard from '../../components/market/ArtistCard.jsx';
import TickerTape from '../../components/market/TickerTape.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import MarketIndex from '../../components/market/MarketIndex.jsx';
import { subscribeSongs, subscribeArtists } from '../../lib/market.js';
import { subscribeApprovedUpcoming } from '../../lib/releases.js';
import Countdown from '../../components/market/Countdown.jsx';

export default function Market() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const u1 = subscribeSongs(setSongs);
    const u2 = subscribeArtists(setArtists);
    const u3 = subscribeApprovedUpcoming(setUpcoming);
    return () => { u1(); u2(); u3(); };
  }, []);

  const topStreaming = useMemo(() => [...songs].sort((a, b) => b.totalStreams - a.totalStreams).slice(0, 10), [songs]);
  const topGainers = useMemo(() => [...songs].sort((a, b) => (b.change7d || 0) - (a.change7d || 0)).slice(0, 5), [songs]);
  const newEntries = useMemo(() => {
    return [...songs]
      .filter((s) => s.releaseDate)
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))
      .slice(0, 5);
  }, [songs]);
  const picks = useMemo(() => songs.filter((s) => s.featured).slice(0, 5), [songs]);
  const watch = useMemo(() => [...artists].sort((a, b) => (b.fanGrowthPct || 0) - (a.fanGrowthPct || 0)).slice(0, 6), [artists]);

  return (
    <>
      <SEO title="Culture Stock Exchange | Direct2Culture" description="Track songs and artists like stocks. Live streaming charts, top gainers, and artists to watch." />
      <TickerTape songs={songs} />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        {upcoming.length > 0 && (
          <Link to="/market/upcoming" className="mb-8 flex items-center justify-between border border-ink bg-ink text-bone p-5 hover:opacity-90">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Drops on deck · {upcoming.length}</p>
              <p className="mt-1 font-sans text-xl font-black tracking-tight">
                {upcoming[0].title} <span className="text-bone/60">by {upcoming[0].artistName}</span>
              </p>
              <div className="mt-2"><Countdown to={upcoming[0].releaseDate} /></div>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em]">Pre-Save →</span>
          </Link>
        )}
        <PageHeader
          eyebrow="Direct2Culture / Market"
          title="Culture Stock Exchange."
          kicker="Songs and artists, charted like stocks. Streams. Trends. Movement."
        />

        <div className="mt-10">
          <MarketIndex
            title="D2C Music Index"
            subtitle="aggregate streams across all listed songs"
            collectionName="streamHistory"
            valueField="streams"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          <Section className="lg:col-span-2" title="Top Streaming Songs" subtitle={`${topStreaming.length} charted`}>
            {topStreaming.length === 0 ? (
              <Empty />
            ) : (
              topStreaming.map((s, i) => <SongCard key={s.id} song={s} rank={i + 1} />)
            )}
          </Section>

          <div className="space-y-10">
            <Section title="Top Gainers" subtitle="7-day movement">
              {topGainers.length === 0 ? <Empty /> : topGainers.map((s, i) => <SongCard key={s.id} song={s} rank={i + 1} />)}
            </Section>
            <Section title="New Entries" subtitle="Latest releases">
              {newEntries.length === 0 ? <Empty /> : newEntries.map((s, i) => <SongCard key={s.id} song={s} rank={i + 1} />)}
            </Section>
          </div>
        </div>

        {picks.length > 0 && (
          <Section className="mt-16" title="Direct2Culture Picks" subtitle="Featured by editorial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
              {picks.map((s, i) => <SongCard key={s.id} song={s} rank={i + 1} />)}
            </div>
          </Section>
        )}

        <Section className="mt-16" title="Independent Artists to Watch" subtitle="Ranked by fan growth">
          {watch.length === 0 ? (
            <Empty />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watch.map((a) => <ArtistCard key={a.id} artist={a} />)}
            </div>
          )}
        </Section>
      </div>
    </>
  );
}

function Section({ title, subtitle, children, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
        <h2 className="font-sans text-2xl font-black tracking-tight">{title}</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Empty() {
  return <p className="text-ink/60 py-6">No data yet. Check back soon.</p>;
}
