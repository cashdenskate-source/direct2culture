import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { addToWatchlist, removeFromWatchlist, isOnWatchlist } from '../../lib/watchlist.js';

export default function WatchButton({ kind, id, ticker, title, subtitle, imageURL, href }) {
  const { user } = useAuth();
  const [on, setOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { setOn(false); return; }
    isOnWatchlist(user.uid, kind, id).then(setOn);
  }, [user, kind, id]);

  async function toggle() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (on) {
      await removeFromWatchlist(user.uid, kind, id);
      setOn(false);
    } else {
      await addToWatchlist(user.uid, { kind, id, ticker, title, subtitle, imageURL, href });
      setOn(true);
    }
  }

  return (
    <button
      onClick={toggle}
      className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
        on ? 'border-ink bg-ink text-bone' : 'border-ink text-ink hover:bg-ink hover:text-bone'
      }`}
    >
      {on ? '★ Watching' : '☆ Watch'}
    </button>
  );
}
