import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitToCollection } from '../../lib/firebase.js';
import { sendWebhook } from '../../lib/webhooks.js';
import { trackCTA } from '../../lib/tracking.js';

export default function CreatorCountdown({ creator }) {
  return (
    <div className="bg-ink text-bone min-h-[80vh] flex items-center">
      <div className="container-edge py-16 lg:py-24 w-full max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
          Creator / {creator.category} · {creator.city}
        </p>
        <h1 className="mt-4 font-sans font-black tracking-tightest text-6xl md:text-8xl leading-[0.95] blur-md select-none">
          {creator.blurredName || maskName(creator.name)}
        </h1>
        <p className="mt-6 text-bone/75 text-xl md:text-2xl leading-snug">
          {creator.teaserText}
        </p>

        {creator.storyDebutDate && (
          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Story debuts in</p>
            <Countdown to={creator.storyDebutDate} />
          </div>
        )}

        <NotifyMeForm creator={creator} />

        <div className="mt-10">
          <Link to="/creators" className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 hover:text-bone">
            ← All creators
          </Link>
        </div>
      </div>
    </div>
  );
}

function maskName(name) {
  return name.split(' ').map((p) => p.length <= 1 ? p : p[0] + '·'.repeat(p.length - 1)).join(' ');
}

function Countdown({ to }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(to).getTime();
  const diff = Math.max(0, target - now);
  if (diff === 0) return <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-green-400">Live now — refresh</p>;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-6 tabular-nums">
      <Unit value={d} label="days" />
      <Unit value={h} label="hours" />
      <Unit value={m} label="minutes" />
      <Unit value={s} label="seconds" />
    </div>
  );
}

function Unit({ value, label }) {
  return (
    <div>
      <p className="font-sans text-5xl md:text-6xl font-black tracking-tightest text-bone">{String(value).padStart(2, '0')}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">{label}</p>
    </div>
  );
}

function NotifyMeForm({ creator }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(e) {
    e.preventDefault();
    if (!form.email) return setState({ status: 'error', message: 'Email required.' });
    setState({ status: 'loading', message: '' });
    try {
      const payload = { ...form, creatorSlug: creator.slug, creatorName: creator.name, kind: 'creator_debut_notify' };
      await submitToCollection('creatorNotifications', payload);
      sendWebhook('creator_debut_notify', payload).catch(() => {});
      trackCTA('creator_debut_notify', { slug: creator.slug });
      setForm({ name: '', email: '' });
      setState({ status: 'success', message: "Locked in. We'll ping you when it drops." });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Could not save.' });
    }
  }

  return (
    <form onSubmit={submit} className="mt-12 border border-bone/15 p-6 lg:p-8 max-w-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Notify Me</p>
      <p className="mt-2 text-bone/80 text-sm">Be first when the story unlocks.</p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="field bg-transparent text-bone placeholder:text-bone/40 border-bone/30" />
        <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="field bg-transparent text-bone placeholder:text-bone/40 border-bone/30" />
      </div>
      <button type="submit" disabled={state.status === 'loading'} className="mt-5 bg-bone text-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] disabled:opacity-50 hover:opacity-90">
        {state.status === 'loading' ? 'Submitting…' : 'Notify Me →'}
      </button>
      {state.message && (
        <p className={`mt-4 font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
