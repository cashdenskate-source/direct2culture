import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/AuthShell.jsx';
import SEO from '../../components/SEO.jsx';
import { signUpCustomer } from '../../lib/auth.js';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setState({ status: 'error', message: 'Name required.' });
    if (form.password.length < 8) return setState({ status: 'error', message: 'Password must be at least 8 characters.' });
    if (form.password !== form.confirm) return setState({ status: 'error', message: 'Passwords do not match.' });

    setState({ status: 'loading', message: '' });
    try {
      const { role } = await signUpCustomer({ email: form.email, password: form.password, name: form.name });
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setState({ status: 'error', message: friendly(err.code) });
    }
  }

  return (
    <>
      <SEO title="Create Account | Direct2Culture" description="Create your Direct2Culture account to submit brands, drops, events, and interview requests." />
      <AuthShell
        eyebrow="Account / Create"
        title="Get on the inside."
        kicker="Build a profile, submit your work, and track your status — direct from the source."
        footer={
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
            Already have an account?{' '}
            <Link to="/login" className="text-ink hover:underline">
              Sign in →
            </Link>
          </p>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="field-label">Full Name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="field" placeholder="Your name" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="field" placeholder="you@email.com" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} className="field" placeholder="Minimum 8 characters" />
          </div>
          <div>
            <label className="field-label">Confirm Password</label>
            <input type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)} className="field" placeholder="Type it again" />
          </div>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary w-full disabled:opacity-50">
            {state.status === 'loading' ? 'Creating…' : 'Create Account →'}
          </button>
          {state.message && (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500">{state.message}</p>
          )}
        </form>
      </AuthShell>
    </>
  );
}

function friendly(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Email already has an account.';
    case 'auth/invalid-email': return 'Email format is invalid.';
    case 'auth/weak-password': return 'Password is too weak.';
    case 'auth/operation-not-allowed': return 'Email/password sign-in is disabled in Firebase Console.';
    default: return 'Could not create account.';
  }
}
