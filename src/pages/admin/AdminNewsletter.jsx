import { useEffect, useState, useMemo } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { listAll, deleteOne } from '../../lib/firestore.js';
import { downloadCSV } from '../../lib/csv.js';

export default function AdminNewsletter() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const r = await listAll('newsletter', { orderField: 'createdAt' });
      setRows(r);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rows.filter((r) => (r.email || '').toLowerCase().includes(q)) : rows;
  }, [rows, search]);

  function onExport() {
    downloadCSV(
      `d2c-newsletter-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((r) => ({
        email: r.email,
        source: r.source || 'site',
        createdAt: formatDate(r.createdAt),
      })),
      ['email', 'source', 'createdAt']
    );
  }

  async function onDelete(id) {
    if (!confirm('Remove this email?')) return;
    await deleteOne('newsletter', id);
    await load();
  }

  return (
    <PageShell
      eyebrow="Admin / Newsletter"
      title="Subscriber list."
      kicker={`${rows.length} subscribers · export anytime as CSV`}
      actions={
        <>
          <button onClick={onExport} disabled={!filtered.length} className="btn-primary disabled:opacity-40">
            Export CSV
          </button>
        </>
      }
    >
      <div className="border-b border-ink/10 pb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email" className="field max-w-sm" />
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink/60">No subscribers.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {filtered.map((r) => (
              <li key={r.id} className="grid grid-cols-12 gap-3 py-4 items-center">
                <p className="col-span-12 sm:col-span-7 font-sans text-base">{r.email}</p>
                <p className="col-span-6 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{r.source || 'site'}</p>
                <p className="col-span-6 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{formatDate(r.createdAt)}</p>
                <button onClick={() => onDelete(r.id)} className="col-span-12 sm:col-span-1 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                  Remove
                </button>
              </li>
            ))}
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  } catch { return '—'; }
}
