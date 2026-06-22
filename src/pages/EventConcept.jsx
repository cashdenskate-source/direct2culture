import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { eventConceptBySlug } from '../data/eventConceptData.js';
import { submitToCollection } from '../lib/firebase.js';
import { sendWebhook } from '../lib/webhooks.js';
import { trackCTA } from '../lib/tracking.js';

const APPLY_KINDS = [
  { id: 'ticket',  label: 'Get Ticket Updates', cta: 'Notify Me →' },
  { id: 'perform', label: 'Apply To Perform',   cta: 'Apply To Perform →' },
  { id: 'vendor',  label: 'Apply As Vendor',    cta: 'Apply As Vendor →' },
  { id: 'sponsor', label: 'Sponsor Event',      cta: 'Sponsor Event →' },
];

export default function EventConcept() {
  const { slug } = useParams();
  const ev = eventConceptBySlug(slug);
  const [kind, setKind] = useState('ticket');
  const [form, setForm] = useState({ name: '', email: '', instagram: '', city: '', role: '', message: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  if (!ev) return <Navigate to="/events" replace />;

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.email) return setState({ status: 'error', message: 'Email required.' });
    setState({ status: 'loading', message: '' });
    try {
      const payload = { ...form, kind, eventSlug: slug };
      await submitToCollection('eventInterest', payload);
      sendWebhook('event_interest', payload).catch(() => {});
      trackCTA(`event_${kind}`, { eventSlug: slug });
      setForm({ name: '', email: '', instagram: '', city: '', role: '', message: '' });
      setState({ status: 'success', message: 'Locked in. Editorial will be in touch.' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Could not save.' });
    }
  }

  return (
    <>
      <SEO title={`${ev.title} | Direct2Culture`} description={ev.excerpt} type="article" />

      <div className="border-b border-ink/10 bg-ink text-bone">
        <div className="container-edge py-16 lg:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Event / Coming Soon</p>
          <h1 className="mt-3 font-sans font-black tracking-tightest text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            {ev.title}.
          </h1>
          <p className="mt-6 max-w-2xl text-bone/75 text-xl md:text-2xl leading-snug">{ev.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {APPLY_KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => { setKind(k.id); document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="border border-bone/40 text-bone px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-bone hover:text-ink transition-colors"
              >
                {k.label} →
              </button>
            ))}
          </div>
        </div>
      </div>

      <article className="container-edge py-16 lg:py-24 max-w-3xl space-y-12">
        {ev.sections.map((s) => (
          <section key={s.title}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{s.title}</p>
            <p className="mt-3 text-lg md:text-xl text-ink/85 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </article>

      <section id="event-form" className="border-t border-ink/10 bg-ink/[0.03]">
        <div className="container-edge py-16 lg:py-20 max-w-3xl">
          <p className="eyebrow">Apply</p>
          <h2 className="mt-2 font-sans text-3xl font-black tracking-tight">Get in early.</h2>
          <p className="mt-3 text-ink/75">Pick how you want in.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {APPLY_KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => setKind(k.id)}
                className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  kind === k.id ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name"><input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
            <Field label="Email"><input type="email" required className="field" value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
            <Field label="Instagram"><input className="field" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" /></Field>
            <Field label="City"><input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} /></Field>
            <Field label="Role / Brand"><input className="field" value={form.role} onChange={(e) => update('role', e.target.value)} placeholder="DJ · Vendor · Sponsor · Fan" /></Field>
            <Field label="Message" full><textarea className="field min-h-[100px] resize-none" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="What do you want to bring?" /></Field>

            <div className="sm:col-span-2 flex items-center justify-between pt-2">
              <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-700' : 'text-red-500'}`}>
                {state.message}
              </p>
              <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
                {state.status === 'loading' ? 'Submitting…' : APPLY_KINDS.find((k) => k.id === kind).cta}
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="container-edge py-8">
        <Link to="/events" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← All events</Link>
      </div>
    </>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
