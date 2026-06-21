import { useState } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { submitToCollection } from '../../lib/firebase.js';
import { sendWebhook } from '../../lib/webhooks.js';
import { notifyNewSubmission } from '../../lib/notifications.js';
import { CATEGORIES } from '../../lib/creatives.js';

export default function SubmitCreative() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: '', ticker: '', category: 'model', city: '', bio: '', instagramURL: '', tiktokURL: '', portfolioURL: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.ticker.trim()) return setState({ status: 'error', message: 'Name and ticker required.' });
    setState({ status: 'loading', message: '' });
    try {
      const payload = {
        type: 'creative',
        ownerUid: user?.uid || null,
        ownerEmail: user?.email || profile?.email || '',
        ...form,
        ticker: form.ticker.toUpperCase(),
        status: 'submitted',
      };
      await submitToCollection('submissions', payload);
      notifyNewSubmission(payload).catch(() => {});
      sendWebhook('new_submission', payload).catch(() => {});
      setForm({ name: '', ticker: '', category: 'model', city: '', bio: '', instagramURL: '', tiktokURL: '', portfolioURL: '' });
      setState({ status: 'success', message: 'Submitted. Editorial will review.' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Submit failed.' });
    }
  }

  return (
    <PageShell
      eyebrow="Customer / Submit Creative"
      title="Apply to the Creative Market."
      kicker="Get listed as a model, director, editor, or photographer on the Direct2Culture Creative Stock Exchange."
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
        <Field label="Name"><input className="field" required value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
        <Field label="Ticker (4-6 chars)"><input className="field" required maxLength={6} value={form.ticker} onChange={(e) => update('ticker', e.target.value.toUpperCase())} placeholder="KAIRO" /></Field>
        <Field label="Category">
          <select className="field" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="City"><input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Los Angeles" /></Field>
        <Field label="Instagram URL"><input className="field" value={form.instagramURL} onChange={(e) => update('instagramURL', e.target.value)} /></Field>
        <Field label="TikTok URL"><input className="field" value={form.tiktokURL} onChange={(e) => update('tiktokURL', e.target.value)} /></Field>
        <Field label="Portfolio URL" full><input className="field" value={form.portfolioURL} onChange={(e) => update('portfolioURL', e.target.value)} placeholder="https://" /></Field>
        <Field label="Bio" full><textarea className="field min-h-[100px] resize-none" value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="Tell us who you are and what you make." /></Field>

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
