import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useAudienceData } from '../../hooks/useAudienceData.js';
import {
  ACTION_LABEL,
  eventsForUser,
  maskUserContact,
  requestFanContact,
  userById,
} from '../../lib/audience.js';

export default function FanProfile() {
  const { id } = useParams();
  const { user: viewer, profile } = useAuth();
  const { users, events, grantedFanIds, loading } = useAudienceData({
    creatorId: viewer?.uid,
  });

  const rawUser = userById(users, id);
  const canSeeContact = grantedFanIds?.has(id) || false;
  const fan = useMemo(
    () => maskUserContact(rawUser, { canSeeContact }),
    [rawUser, canSeeContact]
  );
  const fanEvents = useMemo(() => (rawUser ? eventsForUser(events, rawUser.id) : []), [events, rawUser]);

  const [requestState, setRequestState] = useState({ status: 'idle', message: '' });

  async function onRequestContact() {
    if (!rawUser) return;
    setRequestState({ status: 'loading', message: '' });
    try {
      const res = await requestFanContact({
        creator: { id: viewer?.uid, name: profile?.name || 'Creator' },
        fan: rawUser,
        message: '',
      });
      setRequestState({
        status: 'sent',
        message: res?.mock
          ? 'Request logged (mock — Firebase not wired yet).'
          : `Request sent to ${rawUser.name}.`,
      });
    } catch {
      setRequestState({ status: 'error', message: 'Could not send request.' });
    }
  }

  if (loading) {
    return (
      <PageShell eyebrow="Creator / Fan" title="Loading…" kicker="">
        <div />
      </PageShell>
    );
  }

  if (!fan) {
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

  return (
    <PageShell
      eyebrow={`Creator / Fan / ${fan.name}`}
      title={`${fan.name}.`}
      kicker={`${fan.city}${fan.instagram ? ' · ' + fan.instagram : ''}`}
      actions={<Link to="/dashboard/audience" className="btn-ghost">← Audience</Link>}
    >
      <ContactBlock
        fan={fan}
        canSeeContact={canSeeContact}
        onRequest={onRequestContact}
        state={requestState}
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProfileBlock label="Interests" values={fan.interests} />
        <ProfileBlock label="Favorite artists" values={fan.favoriteArtists} />
        <ProfileBlock label="Favorite brands" values={fan.favoriteBrands} />
        <ProfileBlock label="Favorite DJs" values={fan.favoriteDJs} />
        <ProfileBlock label="Favorite creators" values={fan.favoriteCreators} />
        <ProfileBlock label="Newsletters" values={fan.newsletterPreferences} />
        <ProfileBlock label="Joined" values={[relative(fan.createdAt)]} />
      </div>

      <div className="mt-12">
        <p className="eyebrow">Engagement history</p>
        <ul className="mt-4 divide-y divide-ink/10 border border-ink/15">
          {fanEvents.length === 0 && (
            <li className="px-5 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              No engagement yet.
            </li>
          )}
          {fanEvents.map((e) => (
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

function ContactBlock({ fan, canSeeContact, onRequest, state }) {
  return (
    <div className="border border-ink/15 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
        Contact · {canSeeContact ? 'Tier 2 (granted)' : 'Tier 1 (hidden)'}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Email</p>
          <p className="mt-1 font-sans text-base">
            {canSeeContact ? fan.email : '— hidden until consent'}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Phone</p>
          <p className="mt-1 font-sans text-base">
            {canSeeContact ? (fan.phone || '—') : '— hidden until consent'}
          </p>
        </div>
      </div>

      {!canSeeContact && (
        <div className="mt-5 border-t border-ink/10 pt-4">
          <button
            type="button"
            onClick={onRequest}
            disabled={state.status === 'loading' || state.status === 'sent'}
            className="btn-primary disabled:opacity-50"
          >
            {state.status === 'loading'
              ? 'Sending…'
              : state.status === 'sent'
              ? 'Request sent ✓'
              : 'Request contact →'}
          </button>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            {fan.name} will receive a consent request in their D2C account.
          </p>
          {state.message && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink">
              {state.message}
            </p>
          )}
        </div>
      )}
    </div>
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
