import { useEffect, useState, useMemo } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { listAll, deleteOne } from '../../lib/firestore.js';

export default function AdminMessages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const r = await listAll('contactMessages', { orderField: 'createdAt' });
      setRows(r);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rows.filter((r) => [r.name, r.email, r.subject, r.message].some((v) => (v || '').toLowerCase().includes(q))) : rows;
  }, [rows, search]);

  async function onDelete(id) {
    if (!confirm('Delete this message?')) return;
    await deleteOne('contactMessages', id);
    await load();
  }

  return (
    <PageShell eyebrow="Admin / Messages" title="Contact inbox." kicker={`${rows.length} messages total`}>
      <div className="border-b border-ink/10 pb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inbox" className="field max-w-sm" />
      </div>
      <div className="mt-6">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink/60">Inbox empty.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {filtered.map((m) => {
              const open = openId === m.id;
              return (
                <li key={m.id} className="py-4">
                  <button onClick={() => setOpenId(open ? null : m.id)} className="grid grid-cols-12 gap-3 w-full text-left items-center">
                    <p className="col-span-12 sm:col-span-3 font-sans font-bold tracking-tight">{m.name}</p>
                    <p className="col-span-12 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{m.email}</p>
                    <p className="col-span-9 sm:col-span-3 truncate text-sm">{m.subject}</p>
                    <p className="col-span-3 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{formatDate(m.createdAt)}</p>
                  </button>
                  {open && (
                    <div className="mt-3 border border-ink/10 p-5 bg-bone">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Message</p>
                      <p className="mt-2 text-ink/85 leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      <div className="mt-5 flex gap-3">
                        <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || '')}`} className="btn-primary">Reply →</a>
                        <button onClick={() => onDelete(m.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                          Delete
                        </button>
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
  } catch { return '—'; }
}
