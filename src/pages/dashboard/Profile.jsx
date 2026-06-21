import { useState, useEffect } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { updateUserProfile } from '../../lib/auth.js';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', city: '', website: '', instagram: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
      });
    }
  }, [profile]);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave(e) {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      await updateUserProfile(user.uid, form);
      await refreshProfile();
      setState({ status: 'success', message: 'Profile saved.' });
    } catch {
      setState({ status: 'error', message: 'Save failed.' });
    }
  }

  return (
    <PageShell
      eyebrow="Customer / Profile"
      title="Your profile."
      kicker="Used when editorial considers your submissions."
    >
      <form onSubmit={onSave} className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
        <Field label="Name">
          <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="Email">
          <input className="field opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
        </Field>
        <Field label="City">
          <input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Where you are based" />
        </Field>
        <Field label="Website">
          <input className="field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" />
        </Field>
        <Field label="Instagram">
          <input className="field" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" />
        </Field>
        <Field label="Role">
          <input className="field opacity-60 cursor-not-allowed" value={profile?.role || '—'} disabled />
        </Field>
        <Field label="Short Bio" full>
          <textarea className="field min-h-[120px] resize-none" rows={4} value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="One paragraph. What you do, where you are going." />
        </Field>
        <div className="sm:col-span-2 flex items-center justify-between pt-2">
          <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-ink' : 'text-red-500'}`}>
            {state.message}
          </p>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
            {state.status === 'loading' ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </PageShell>
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
