import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { updateUserProfile, resetPassword, signOut } from '../../lib/auth.js';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [optIn, setOptIn] = useState(profile?.newsletterOptIn ?? true);
  const [msg, setMsg] = useState('');

  async function toggleNewsletter() {
    const next = !optIn;
    setOptIn(next);
    await updateUserProfile(user.uid, { newsletterOptIn: next });
    await refreshProfile();
    setMsg(next ? 'Newsletter on.' : 'Newsletter off.');
  }

  async function onReset() {
    await resetPassword(user.email);
    setMsg('Password reset link sent.');
  }

  async function onLogout() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <PageShell eyebrow="Customer / Settings" title="Settings." kicker="Email preferences, password, account.">
      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <Row title="Newsletter">
          <div className="flex items-center justify-between">
            <p className="text-ink/70">Weekly culture brief, direct to {user?.email}.</p>
            <button onClick={toggleNewsletter} className="btn-ghost">
              {optIn ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </Row>
        <Row title="Password">
          <div className="flex items-center justify-between">
            <p className="text-ink/70">Send a reset link to your email.</p>
            <button onClick={onReset} className="btn-ghost">Reset Password</button>
          </div>
        </Row>
        <Row title="Account">
          <div className="flex items-center justify-between">
            <p className="text-ink/70">Sign out of this device.</p>
            <button onClick={onLogout} className="btn-ghost">Sign Out</button>
          </div>
        </Row>

        {msg && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{msg}</p>}
      </div>
    </PageShell>
  );
}

function Row({ title, children }) {
  return (
    <div className="border border-ink/15 p-6">
      <p className="eyebrow">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
