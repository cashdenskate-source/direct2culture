import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import PageShell from '../../components/PageShell.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? rows.filter((r) => [r.name, r.email].some((v) => (v || '').toLowerCase().includes(q)))
      : rows;
  }, [rows, search]);

  return (
    <PageShell
      eyebrow="Admin / Sign-Ups"
      title="New accounts."
      kicker={`${rows.length} total · live updates`}
    >
      <div className="border-b border-ink/10 pb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="field max-w-sm"
        />
      </div>
      <div className="mt-6">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink/60">No sign-ups yet.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {filtered.map((u) => {
              const open = openId === u.id;
              return (
                <li key={u.id} className="py-4">
                  <button
                    onClick={() => setOpenId(open ? null : u.id)}
                    className="grid grid-cols-12 gap-3 w-full text-left items-center"
                  >
                    <div className="col-span-12 sm:col-span-3 flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
                            {(u.name || u.email || '?').slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <p className="font-sans font-bold tracking-tight truncate">{u.name || '—'}</p>
                    </div>
                    <p className="col-span-12 sm:col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                      {u.email}
                    </p>
                    <p className="col-span-6 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                      {u.phone || '—'}
                    </p>
                    <p className="col-span-3 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em]">
                      <span className="inline-block border border-ink/30 px-1.5 py-0.5">
                        {u.userType || 'fan'}
                      </span>
                    </p>
                    <p className="col-span-3 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                      {formatDate(u.createdAt)}
                    </p>
                  </button>
                  {open && (
                    <div className="mt-3 border border-ink/10 p-5 bg-bone">
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">UID</dt>
                        <dd className="font-mono text-xs break-all">{u.uid}</dd>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Phone</dt>
                        <dd>{u.phone || '—'}</dd>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Newsletter</dt>
                        <dd>{u.newsletterOptIn ? 'Opted in' : 'No'}</dd>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Joined</dt>
                        <dd>{formatDateLong(u.createdAt)}</dd>
                      </dl>
                      <div className="mt-5 flex gap-3">
                        <a href={`mailto:${u.email}`} className="btn-primary">Email →</a>
                        {u.phone && (
                          <a href={`tel:${u.phone}`} className="btn-primary">Call →</a>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

function formatDateLong(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '—';
  }
}
