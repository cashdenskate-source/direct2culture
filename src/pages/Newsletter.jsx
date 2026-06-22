import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { submitToCollection } from '../lib/firebase.js';
import { notifyNewsletterSignup } from '../lib/notifications.js';
import { sendWebhook } from '../lib/webhooks.js';

const CATEGORIES = ['Music', 'Fashion', 'Skate', 'DJs', 'Brands', 'Events', 'Creators', 'Markets'];

export default function Newsletter() {
  const [form, setForm] = useState({ name: '', email: '', interests: [] });
  const [state, setState] = useState({ status: 'idle', message: '' });

  function toggle(c) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(c) ? f.interests.filter((x) => x !== c) : [...f.interests, c],
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.email) return setState({ status: 'error', message: 'Email required.' });
    setState({ status: 'loading', message: '' });
    try {
      await submitToCollection('newsletter', {
        name: form.name,
        email: form.email,
        interests: form.interests,
        source: 'newsletter_page',
      });
      await notifyNewsletterSignup(form);
      await sendWebhook('new_newsletter_signup', form);
      setForm({ name: '', email: '', interests: [] });
      setState({ status: 'success', message: 'On the list. Watch your inbox.' });
    } catch {
      setState({ status: 'error', message: 'Could not subscribe. Try again.' });
    }
  }

  return (
    <>
      <SEO title="The Culture Brief | Direct2Culture" description="The weekly Direct2Culture brief on artists, brands, creators, drops, events, and culture signals shaping what comes next." />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / The Culture Brief"
          title="The Culture Brief."
          kicker="The weekly brief on artists, brands, creators, drops, events, and culture signals shaping what comes next. Pick what you want, skip what you don't."
        />

        <form onSubmit={onSubmit} className="mt-12 max-w-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Name (optional)</label>
              <input className="field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" required className="field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
            </div>
          </div>

          <div>
            <label className="field-label">What are you here for?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggle(c)}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                    form.interests.includes(c) ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
            {state.status === 'loading' ? 'Subscribing…' : 'Join The Culture Brief →'}
          </button>

          {state.message && (
            <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-700' : 'text-red-500'}`}>
              {state.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
