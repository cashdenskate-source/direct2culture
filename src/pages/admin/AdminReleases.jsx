import { useEffect, useState } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { subscribeUpcoming, updateRelease, deleteRelease, countPresaves } from '../../lib/releases.js';

export default function AdminReleases() {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const unsub = subscribeUpcoming(setRows);
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = {};
      for (const r of rows) {
        c[r.id] = await countPresaves(r.id);
      }
      if (!cancelled) setCounts(c);
    })();
    return () => { cancelled = true; };
  }, [rows]);

  async function setStatus(id, status) {
    await updateRelease(id, { status });
  }

  async function onDelete(id) {
    if (!confirm('Delete this release?')) return;
    await deleteRelease(id);
  }

  return (
    <PageShell
      eyebrow="Admin / Releases"
      title="Upcoming drops."
      kicker={`${rows.length} releases · approve to publish to /market/upcoming`}
    >
      {rows.length === 0 ? (
        <p className="text-ink/60">No releases submitted yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {rows.map((r) => (
            <li key={r.id} className="py-5 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 sm:col-span-1">
                <div className="h-14 w-14 overflow-hidden border border-ink/10 bg-ink/5">
                  {r.coverURL ? <img src={r.coverURL} className="h-full w-full object-cover" /> : null}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-4 min-w-0">
                <p className="font-sans font-bold tracking-tight truncate">{r.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                  {r.artistName} · {r.type}
                </p>
              </div>
              <p className="col-span-6 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {r.releaseDate?.toDate ? r.releaseDate.toDate().toLocaleString() : ''}
              </p>
              <p className="col-span-3 sm:col-span-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash text-right">
                {counts[r.id] ?? '—'} <span className="text-ash">presaves</span>
              </p>
              <p className="col-span-3 sm:col-span-1">
                <span className={`font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-1 border inline-block ${
                  r.status === 'approved' ? 'border-green-700 text-green-700' :
                  r.status === 'rejected' ? 'border-red-600 text-red-600' :
                  r.status === 'live' ? 'border-ink bg-ink text-bone' :
                  'border-ash text-ash'
                }`}>
                  {r.status}
                </span>
              </p>
              <div className="col-span-12 sm:col-span-3 flex flex-wrap items-center justify-end gap-2">
                {r.status !== 'approved' && (
                  <button onClick={() => setStatus(r.id, 'approved')} className="font-mono text-[10px] uppercase tracking-[0.25em] text-green-700 hover:underline">
                    Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => setStatus(r.id, 'rejected')} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                    Reject
                  </button>
                )}
                <button onClick={() => onDelete(r.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
