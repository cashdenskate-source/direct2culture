import { useState } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { submitToCollection } from '../../lib/firebase.js';
import { sendWebhook } from '../../lib/webhooks.js';
import { notifyNewSubmission } from '../../lib/notifications.js';

export default function SubmitDJ() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: '', handle: '', city: '', genres: '', venues: '', instagramURL: '', soundcloudURL: '', bio: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.handle.trim()) return setState({ status: 'error', message: 'Name and handle required.' });
    setState({ status: 'loading', message: '' });
    try {
      const payload = {
        type: 'dj',
        ownerUid: user?.uid || null,
        ownerEmail: user?.email || profile?.email || '',
        name: form.name,
        handle: form.handle.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        city: form.city,
        genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
        venues: form.venues.split(',').map((v) => v.trim()).filter(Boolean),
        instagramURL: form.instagramURL,
        soundcloudURL: form.soundcloudURL,
        bio: form.bio,
        status: 'submitted',
      };
      await submitToCollection('submissions', payload);
      notifyNewSubmission(payload).catch(() => {});
      sendWebhook('new_submission', payload).catch(() => {});
      setForm({ name: '', handle: '', city: '', genres: '', venues: '', instagramURL: '', soundcloudURL: '', bio: '' });
      setState({ status: 'success', message: 'Submitted. Editorial will review and add you to the DJ Market.' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Submit failed.' });
    }
  }

  return (
    <PageShell
      eyebrow="Customer / Submit DJ"
      title="Apply to the DJ Market."
      kicker="Get listed on the D2C DJ Stock Exchange. Log spins. Build influence."
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
        <Field label="DJ Name"><input className="field" required value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
        <Field label="Handle (no @)"><input className="field" required value={form.handle} onChange={(e) => update('handle', e.target.value)} placeholder="djkairo" /></Field>
        <Field label="City"><input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Los Angeles" /></Field>
        <Field label="Genres (comma separated)"><input className="field" value={form.genres} onChange={(e) => update('genres', e.target.value)} placeholder="Hip-Hop, R&B, House" /></Field>
        <Field label="Venues (comma separated)" full><input className="field" value={form.venues} onChange={(e) => update('venues', e.target.value)} placeholder="Output, Elsewhere, Project 9" /></Field>
        <Field label="Instagram URL"><input className="field" value={form.instagramURL} onChange={(e) => update('instagramURL', e.target.value)} placeholder="https://instagram.com/handle" /></Field>
        <Field label="SoundCloud URL"><input className="field" value={form.soundcloudURL} onChange={(e) => update('soundcloudURL', e.target.value)} placeholder="https://soundcloud.com/handle" /></Field>
        <Field label="Bio" full><textarea className="field min-h-[100px] resize-none" value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="What's your sound? Who do you spin for? What sets you apart?" /></Field>

        <div className="sm:col-span-2 flex items-center justify-between pt-2">
          <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-700' : 'text-red-500'}`}>{state.message}</p>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
            {state.status === 'loading' ? 'Submitting…' : 'Submit Application →'}
          </button>
        </div>
      </form>
    </PageShell>
  );
}

function Field({ label, full, children }) {
  return <div className={full ? 'sm:col-span-2' : ''}><label className="field-label">{label}</label>{children}</div>;
}
