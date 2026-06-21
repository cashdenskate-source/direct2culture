import { useState } from 'react';
import { submitToCollection } from '../lib/firebase.js';

const empty = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email required.';
    if (!form.subject.trim()) return 'Subject is required.';
    if (!form.message.trim() || form.message.trim().length < 10) return 'Message must be at least 10 characters.';
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setState({ status: 'error', message: err });
      return;
    }
    setState({ status: 'loading', message: '' });
    try {
      await submitToCollection('contact_messages', form);
      setState({ status: 'success', message: 'Message received. We read every email.' });
      setForm(empty);
    } catch {
      setState({ status: 'error', message: 'Failed to send. Try again.' });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="border border-ink p-10 bg-bone">
        <p className="eyebrow">D2C / Received</p>
        <h3 className="display-md mt-4">Got it.</h3>
        <p className="mt-4 max-w-xl text-ink/70 text-lg">{state.message}</p>
        <button onClick={() => setState({ status: 'idle', message: '' })} className="btn-ghost mt-8">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="field-label">Name *</label>
        <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
      </div>
      <div>
        <label className="field-label">Email *</label>
        <input type="email" className="field" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Subject *</label>
        <input className="field" value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="What is this about" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Message *</label>
        <textarea
          className="field min-h-[160px] resize-none"
          rows={6}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Tell us what you need."
        />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          Replies within 48 hours.
        </p>
        <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
          {state.status === 'loading' ? 'Sending…' : 'Send Message →'}
        </button>
      </div>
      {state.status === 'error' && (
        <p className="sm:col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-red-500">{state.message}</p>
      )}
    </form>
  );
}
