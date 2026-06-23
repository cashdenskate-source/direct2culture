import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import StatTile from '../../components/StatTile.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useAudienceData } from '../../hooks/useAudienceData.js';
import { analyze } from '../../lib/audience.js';

export default function Audience() {
  const { user } = useAuth();
  const { users, events, grantedFanIds, source, loading } = useAudienceData({
    creatorId: user?.uid,
  });
  const a = useMemo(() => analyze(users, events), [users, events]);

  return (
    <PageShell
      eyebrow="Creator / Audience"
      title="Your audience on D2C."
      kicker="Fans who created accounts and engaged directly on Direct2Culture."
    >
      {source === 'mock' && !loading && (
        <div className="mb-4 border border-ink/10 bg-ink/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          Demo data — real fans will appear here once signups begin.
        </div>
      )}

      <div className="mb-10 border border-ink/15 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          Privacy · Tier 1 default
        </p>
        <p className="mt-3 text-sm text-ink/80 leading-relaxed">
          Fan names, cities, and engagement are visible by default. Email and
          phone are hidden until the fan grants you contact access — request it
          from their profile.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatTile label="Total fans" value={loading ? '…' : a.totalFans} sub="On Direct2Culture" />
        <StatTile label="New fans (7d)" value={loading ? '…' : a.newFansThisWeek} sub="Last 7 days" />
        <StatTile label="Newsletter subs" value={loading ? '…' : a.newsletterSubscribers} sub="Culture Brief" />
        <StatTile label="Music link clicks" value={loading ? '…' : a.musicLinkClicks} sub="Tracked on D2C" />
        <StatTile label="Waitlist signups" value={loading ? '…' : a.waitlistSignups} sub="Drops queued" />
        <StatTile label="Story saves" value={loading ? '…' : a.storySaves} sub="Reads kept" />
      </div>

      <Section title="Most engaged fans">
        <EngagedFanList rows={a.mostEngagedUsers} grantedFanIds={grantedFanIds} loading={loading} />
      </Section>

      <Section title="Top cities">
        <CountList items={a.topCityPercentages.map(({ city, pct }) => ({ name: city, value: `${pct.toFixed(0)}%` }))} />
      </Section>

      <Section title="Top stories read">
        <CountList items={a.topStoriesRead.map(({ name, count }) => ({ name, value: `${count} reads` }))} />
      </Section>

      <Section title="Top songs clicked">
        <CountList items={a.topSongsClicked.map(({ name, count }) => ({ name, value: `${count} clicks` }))} />
      </Section>

      <Section title="Top creators followed">
        <CountList items={a.topCreatorsFollowed.map(({ name, count }) => ({ name, value: `${count} follows` }))} />
      </Section>

      <Section title="Top brands followed">
        <CountList items={a.topBrandsFollowed.map(({ name, count }) => ({ name, value: `${count} follows` }))} />
      </Section>
    </PageShell>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-12">
      <p className="eyebrow">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EngagedFanList({ rows, grantedFanIds, loading }) {
  if (loading) {
    return <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Loading…</p>;
  }
  if (rows.length === 0) {
    return <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">No engagement yet.</p>;
  }
  return (
    <ul className="divide-y divide-ink/10 border border-ink/15">
      {rows.map(({ user, count }) => {
        const canSeeContact = grantedFanIds?.has(user.id);
        return (
          <li key={user.id}>
            <Link
              to={`/dashboard/fan/${user.id}`}
              className="grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/5"
            >
              <div className="col-span-12 sm:col-span-5">
                <p className="font-sans font-bold tracking-tight">{user.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                  {canSeeContact ? user.email : 'Contact hidden · Tier 1'}
                </p>
              </div>
              <p className="col-span-6 sm:col-span-4 font-sans text-sm text-ink/80">{user.city}</p>
              <p className="col-span-6 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {count} actions
              </p>
              <p className="col-span-12 sm:col-span-1 sm:text-right font-mono text-[10px] text-ash">→</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function CountList({ items }) {
  if (!items || items.length === 0) {
    return <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">No data yet.</p>;
  }
  return (
    <ul className="divide-y divide-ink/10 border border-ink/15">
      {items.map((it) => (
        <li key={it.name} className="flex items-center justify-between px-5 py-3">
          <span className="font-sans text-sm">{it.name}</span>
          <span className="font-mono text-xs text-ash">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}
