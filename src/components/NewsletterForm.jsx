import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { submitToCollection } from '../lib/firebase.js';
import { trackNewsletterSignup, userFromAuth } from '../lib/audience.js';

export default function NewsletterForm({ variant = 'light' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });
  const { user, profile } = useAuth();

  const isDark = variant === 'dark';

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ status: 'error', message: 'Enter a valid email address.' });
      return;
    }
    setState({ status: 'loading', message: '' });
    try {
      await submitToCollection('newsletter', { email, source: 'site' });

      const audUser = userFromAuth(user, profile);
      if (audUser) {
        trackNewsletterSignup({
          user: audUser,
          newsletterId: 'culture_brief',
          newsletterName: 'Culture Brief',
        }).catch(() => {});
      }

      setState({ status: 'success', message: 'You are on the list. Watch your inbox.' });
      setEmail('');
    } catch {
      setState({ status: 'error', message: 'Something broke. Try again in a moment.' });
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={`flex items-center gap-3 border-b ${isDark ? 'border-bone/30' : 'border-ink/30'} pb-2`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={`flex-1 bg-transparent py-2 text-base focus:outline-none ${
            isDark ? 'text-bone placeholder:text-bone/40' : 'text-ink placeholder:text-ash/70'
          }`}
        />
        <button
          type="submit"
          disabled={state.status === 'loading'}
          className={`font-mono text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 ${
            isDark ? 'text-bone hover:underline' : 'text-ink hover:underline'
          }`}
        >
          {state.status === 'loading' ? 'Joining…' : 'Subscribe →'}
        </button>
      </div>
      {state.message && (
        <p
          className={`mt-3 font-mono text-[11px] uppercase tracking-[0.2em] ${
            state.status === 'success'
              ? isDark ? 'text-bone' : 'text-ink'
              : 'text-red-500'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
