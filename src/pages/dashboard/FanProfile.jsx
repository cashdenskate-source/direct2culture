import { Link, useParams } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { ACTION_LABEL, eventsForUser, userById } from '../../lib/audience.js';

export default function FanProfile() {
  const { id } = useParams();
  const user = userById(id);

  if (!user) {
    return (
      <PageShell
        eyebrow="Creator / Fan"
        title="Fan not found."
        kicker="That fan ID isn't in the Identity Graph."
        actions={<Link to="/dashboard/audience" className="btn-ghost">← Back to Audience</Link>}
      >
        <div />
      </PageShell>
    );
  }

  const events = eventsForUser(user.id);

  return (
    <PageShell
      eyebrow={`Creator / Fan / ${user.name}`}
      title={`${user.name}.`}
      kicker={`${user.city}${user.instagram ? ' · ' + user.instagram : ''} · ${user.email}`}
      actions={<Link to="/dashboard/audience" className="btn-ghost">← Audience</Link>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProfileBlock label="Interests" values={user.interests} />
        <ProfileBlock label="Favorite artists" values={user.favoriteArtists} />
        <ProfileBlock label="Favorite brands" values={user.favoriteBrands} />
        <ProfileBlock label="Favorite DJs" values={user.favoriteDJs} />
        <ProfileBlock label="Favorite creators" values={user.favoriteCreators} />
        <ProfileBlock label="Newsletters" values={user.newsletterPreferences} />
        <ProfileBlock label="Joined" values={[relative(user.createdAt)]} />
      </div>

      <div className="mt-12">
        <p className="eyebrow">Engagement history</p>
        <ul className="mt-4 divide-y divide-ink/10 border border-ink/15">
          {events.length === 0 && (
            <li className="px-5 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              No engagement yet.
            </li>
          )}
          {events.map((e) => (
            <li key={e.id} className="grid grid-cols-12 gap-4 px-5 py-4">
              <div className="col-span-12 sm:col-span-7">
                <p className="font-sans font-semibold">{ACTION_LABEL[e.actionType] || e.actionType}</p>
                <p className="mt-1 font-mono text-[11px] text-ash">{e.entityName}</p>
              </div>
              <p className="col-span-6 sm:col-span-3 self-center font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {e.platform}
              </p>
              <p className="col-span-6 sm:col-span-2 self-center sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {relative(e.timestamp)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}

function ProfileBlock({ label, values }) {
  return (
    <div className="border border-ink/15 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-3 font-sans text-base">
        {values && values.length ? values.join(', ') : '—'}
      </p>
    </div>
  );
}

function relative(d) {
  if (!d) return '—';
  const t = new Date(d).getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const days = Math.floor(h / 24);
  if (days >= 1) return `${days}d ago`;
  if (h >= 1) return `${h}h ago`;
  if (m >= 1) return `${m}m ago`;
  return 'just now';
}
