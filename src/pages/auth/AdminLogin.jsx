import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/AuthShell.jsx';
import SEO from '../../components/SEO.jsx';
import { signIn, fetchUserProfile, signOut } from '../../lib/auth.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const user = await signIn({ email, password });
      const profile = await fetchUserProfile(user.uid);
      const role = profile?.role;
      if (role !== 'admin' && role !== 'editor') {
        await signOut();
        setState({ status: 'error', message: 'This account does not have admin access.' });
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setState({ status: 'error', message: friendly(err.code) });
    }
  }

  return (
    <>
      <SEO title="Admin Sign In | Direct2Culture" description="Direct2Culture admin sign-in." />
      <AuthShell
        eyebrow="Admin / Restricted"
        title="Admin sign in."
        kicker="Editorial team only. If you are submitting a brand, use the customer sign in instead."
        footer={
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
            Not staff?{' '}
            <Link to="/login" className="text-ink hover:underline">
              Customer sign in →
            </Link>
          </p>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="field-label">Admin Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="admin@direct2culture.com" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary w-full disabled:opacity-50">
            {state.status === 'loading' ? 'Verifying…' : 'Sign In →'}
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
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
    case 'auth/operation-not-allowed': return 'Email/password sign-in is disabled in Firebase Console.';
    default: return 'Sign in failed.';
  }
}
