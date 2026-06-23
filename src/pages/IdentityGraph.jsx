import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import StatTile from '../components/StatTile.jsx';
import { useAudienceData } from '../hooks/useAudienceData.js';
import { analyze } from '../lib/audience.js';

export default function IdentityGraph() {
  const { users, events, loading, source } = useAudienceData();
  const a = useMemo(() => analyze(users, events), [users, events]);

  return (
    <>
      <Helmet>
        <title>Identity Graph — Direct2Culture</title>
        <meta
          name="description"
          content="Direct2Culture only shows audience identity for fans who create accounts and engage directly on D2C."
        />
      </Helmet>

      <section className="container-edge py-16 lg:py-24">
        <p className="eyebrow">The D2C Identity Graph</p>
        <h1 className="display-lg mt-4">Culture you can see.</h1>
        <p className="mt-6 max-w-2xl text-base text-ink/70 leading-relaxed">
          A public view of the audience engaging directly on Direct2Culture —
          fan count, city mix, and what culture is moving them.
        </p>

        <div className="mt-10 max-w-3xl border border-ink/15 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            Privacy
          </p>
          <p className="mt-3 text-sm text-ink/80 leading-relaxed">
            Direct2Culture only shows audience identity for fans who create
            accounts and engage directly on Direct2Culture. Streaming platforms
            do not reveal exact listener identities.
          </p>
        </div>

        {source === 'mock' && !loading && (
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            Demo data shown — real fan numbers appear here once signups begin.
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Fans on D2C" value={loading ? '…' : a.totalFans} sub="Accounts created" />
          <StatTile label="Music link clicks" value={loading ? '…' : a.musicLinkClicks} sub="Tracked on D2C" />
          <StatTile label="Story saves" value={loading ? '…' : a.storySaves} sub="Reads kept" />
        </div>

        <div className="mt-16">
          <p className="eyebrow">City mix</p>
          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight">
            Where the audience is.
          </h2>
          <ul className="mt-6 divide-y divide-ink/10 border border-ink/15">
            {a.topCityPercentages.length === 0 && !loading && (
              <li className="px-5 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                No data yet.
              </li>
            )}
            {a.topCityPercentages.map(({ city, pct }) => (
              <li key={city} className="flex items-center justify-between px-5 py-4">
                <span className="font-sans text-base">{city}</span>
                <span className="font-mono text-sm font-semibold">
                  {pct.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-10">
          <p className="eyebrow">For creators</p>
          <h3 className="mt-3 font-sans text-xl font-bold tracking-tight">
            See your audience by name.
          </h3>
          <p className="mt-3 max-w-xl text-sm text-ink/70">
            Sign in to your creator dashboard to see fan names, cities, and the
            exact actions they take on Direct2Culture.
          </p>
          <Link to="/dashboard/audience" className="btn-primary mt-6">
            Open Creator Dashboard →
          </Link>
        </div>
      </section>
    </>
  );
}
