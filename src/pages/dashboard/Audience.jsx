import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import StatTile from '../../components/StatTile.jsx';
import {
  totalFans,
  newFansThisWeek,
  newsletterSubscribers,
  musicLinkClicks,
  waitlistSignups,
  storySaves,
  topCityPercentages,
  mostEngagedUsers,
  topStoriesRead,
  topSongsClicked,
  topCreatorsFollowed,
  topBrandsFollowed,
} from '../../lib/audience.js';

export default function Audience() {
  return (
    <PageShell
      eyebrow="Creator / Audience"
      title="Your audience on D2C."
      kicker="Fans who created accounts and engaged directly on Direct2Culture."
    >
      <div className="mb-10 border border-ink/15 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          Privacy
        </p>
        <p className="mt-3 text-sm text-ink/80 leading-relaxed">
          Direct2Culture only shows audience identity for fans who create
          accounts and engage directly on Direct2Culture. Streaming platforms
          do not reveal exact listener identities.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatTile label="Total fans" value={totalFans()} sub="On Direct2Culture" />
        <StatTile label="New fans (7d)" value={newFansThisWeek()} sub="Last 7 days" />
        <StatTile label="Newsletter subs" value={newsletterSubscribers()} sub="Culture Brief" />
        <StatTile label="Music link clicks" value={musicLinkClicks()} sub="Tracked on D2C" />
        <StatTile label="Waitlist signups" value={waitlistSignups()} sub="Drops queued" />
        <StatTile label="Story saves" value={storySaves()} sub="Reads kept" />
      </div>

      <Section title="Most engaged fans">
        <EngagedFanList />
      </Section>

      <Section title="Top cities">
        <CountList items={topCityPercentages().map(({ city, pct }) => ({ name: city, value: `${pct.toFixed(0)}%` }))} />
      </Section>

      <Section title="Top stories read">
        <CountList items={topStoriesRead().map(({ name, count }) => ({ name, value: `${count} reads` }))} />
      </Section>

      <Section title="Top songs clicked">
        <CountList items={topSongsClicked().map(({ name, count }) => ({ name, value: `${count} clicks` }))} />
      </Section>

      <Section title="Top creators followed">
        <CountList items={topCreatorsFollowed().map(({ name, count }) => ({ name, value: `${count} follows` }))} />
      </Section>

      <Section title="Top brands followed">
        <CountList items={topBrandsFollowed().map(({ name, count }) => ({ name, value: `${count} follows` }))} />
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

function EngagedFanList() {
  const rows = mostEngagedUsers();
  if (rows.length === 0) {
    return <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">No engagement yet.</p>;
  }
  return (
    <ul className="divide-y divide-ink/10 border border-ink/15">
      {rows.map(({ user, count }) => (
        <li key={user.id}>
          <Link
            to={`/dashboard/fan/${user.id}`}
            className="grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/5"
          >
            <div className="col-span-12 sm:col-span-5">
              <p className="font-sans font-bold tracking-tight">{user.name}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">{user.email}</p>
            </div>
            <p className="col-span-6 sm:col-span-4 font-sans text-sm text-ink/80">{user.city}</p>
            <p className="col-span-6 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              {count} actions
            </p>
            <p className="col-span-12 sm:col-span-1 sm:text-right font-mono text-[10px] text-ash">→</p>
          </Link>
        </li>
      ))}
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
