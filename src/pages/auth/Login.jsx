import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/AuthShell.jsx';
import SEO from '../../components/SEO.jsx';
import { signIn, resetPassword, fetchUserProfile } from '../../lib/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const user = await signIn({ email, password });
      const profile = await fetchUserProfile(user.uid);
      const role = profile?.role || 'customer';
      const dest = role === 'admin' || role === 'editor' ? '/admin/dashboard' : location.state?.from || '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      setState({ status: 'error', message: friendly(err.code) });
    }
  }

  async function onReset() {
    if (!email) {
      setState({ status: 'error', message: 'Enter your email first.' });
      return;
    }
    setState({ status: 'loading', message: '' });
    try {
      await resetPassword(email);
      setState({ status: 'success', message: 'Reset link sent. Check your inbox.' });
    } catch (err) {
      setState({ status: 'error', message: friendly(err.code) });
    }
  }

  return (
    <>
      <SEO title="Sign In | Direct2Culture" description="Sign in to your Direct2Culture dashboard." />
      <AuthShell
        eyebrow="Account / Sign In"
        title="Welcome back."
        kicker="Brands, artists, founders, creators — pick up where you left off."
        footer={
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
            No account yet?{' '}
            <Link to="/signup" className="text-ink hover:underline">
              Create one →
            </Link>
          </p>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="field-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@email.com" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary w-full disabled:opacity-50">
            {state.status === 'loading' ? 'Signing in…' : 'Sign In →'}
          </button>
          <button type="button" onClick={onReset} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
            Forgot password? Send reset link →
          </button>
          {state.message && (
            <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-ink' : 'text-red-500'}`}>
              {state.message}
            </p>
          )}
        </form>
      </AuthShell>
    </>
  );
}

function friendly(code) {
  switch (code) {
    case 'auth/invalid-email': return 'Email format is invalid.';
    case 'auth/missing-password': return 'Enter a password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
    case 'auth/operation-not-allowed': return 'Email/password sign-in is disabled in Firebase Console.';
    default: return 'Sign in failed. Try again.';
  }
}
