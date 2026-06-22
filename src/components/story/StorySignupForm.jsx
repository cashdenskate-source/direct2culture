import { useState } from 'react';

export default function StorySignupForm({ id, heading, sublabel, onSubmit, ctaLabel = 'Sign Up →' }) {
  const [form, setForm] = useState({ name: '', email: '', city: '', instagram: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.email.trim()) return setState({ status: 'error', message: 'Email required.' });
    setState({ status: 'loading', message: '' });
    try {
      await onSubmit(form);
      setForm({ name: '', email: '', city: '', instagram: '' });
      setState({ status: 'success', message: "You're on the list. Watch your inbox." });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Could not sign up.' });
    }
  }

  return (
    <form id={id} onSubmit={submit} className="border border-ink/15 p-6 lg:p-8 bg-bone">
      {heading && <p className="eyebrow">{heading}</p>}
      {sublabel && <p className="mt-2 text-ink/85">{sublabel}</p>}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Name"><input value={form.name} onChange={(e) => update('name', e.target.value)} className="field" placeholder="Your name" /></Field>
        <Field label="Email"><input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="field" placeholder="you@email.com" /></Field>
        <Field label="City"><input value={form.city} onChange={(e) => update('city', e.target.value)} className="field" placeholder="Where you at" /></Field>
        <Field label="Instagram (optional)"><input value={form.instagram} onChange={(e) => update('instagram', e.target.value)} className="field" placeholder="@handle" /></Field>
      </div>

      <button type="submit" disabled={state.status === 'loading'} className="mt-5 btn-primary disabled:opacity-50">
        {state.status === 'loading' ? 'Submitting…' : ctaLabel}
      </button>

      {state.message && (
        <p className={`mt-4 font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-700' : 'text-red-500'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
