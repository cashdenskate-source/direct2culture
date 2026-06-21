import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { subscribeWatchlist, removeFromWatchlist } from '../../lib/watchlist.js';

export default function Watchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeWatchlist(user.uid, setItems);
    return () => unsub();
  }, [user]);

  async function onRemove(kind, id) {
    await removeFromWatchlist(user.uid, kind, id);
  }

  const grouped = items.reduce((acc, it) => {
    (acc[it.kind] = acc[it.kind] || []).push(it);
    return acc;
  }, {});

  return (
    <PageShell
      eyebrow="Customer / Watchlist"
      title="Your watchlist."
      kicker="Songs, artists, brands you're tracking. Pinned across the Culture Stock Exchange."
    >
      {items.length === 0 ? (
        <div className="border border-ink/10 p-8 mt-6">
          <p className="text-ink/70">Nothing on your watchlist yet.</p>
          <p className="mt-2 text-ink/60 text-sm">Tap the ☆ on any song, artist, or brand on the market to add it here.</p>
          <Link to="/market" className="mt-5 inline-block btn-primary">Browse Market →</Link>
        </div>
      ) : (
        <div className="space-y-12 mt-8">
          {Object.entries(grouped).map(([kind, group]) => (
            <section key={kind}>
              <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
                <h2 className="font-sans text-2xl font-black tracking-tight capitalize">{kind}s · {group.length}</h2>
              </div>
              <ul className="divide-y divide-ink/10">
                {group.map((it) => (
                  <li key={it.docId} className="py-4 flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
                      {it.imageURL ? (
                        <img src={it.imageURL} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                          {(it.ticker || it.title || '?').slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold tracking-tight truncate">
                        {it.ticker && <>${it.ticker} · </>}{it.title}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">{it.subtitle}</p>
                    </div>
                    {it.href && (
                      <Link to={it.href} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
                        Open →
                      </Link>
                    )}
                    <button onClick={() => onRemove(it.kind, it.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
