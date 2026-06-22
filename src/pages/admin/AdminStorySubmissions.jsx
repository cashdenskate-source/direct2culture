import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import PageShell from '../../components/PageShell.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';

const TABS = [
  { id: 'storySubmissions', label: 'Stories' },
  { id: 'videoSubmissions', label: 'Videos' },
  { id: 'ticketSignups', label: 'RichSkater Tickets' },
  { id: 'dropSignups', label: 'BarelySain Drops' },
];

const STATUSES = ['submitted', 'under_review', 'needs_edits', 'approved', 'featured', 'rejected'];

export default function AdminStorySubmissions() {
  const [tab, setTab] = useState('storySubmissions');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    const q = query(collection(db, tab), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => setItems([]));
    return () => unsub();
  }, [tab]);

  async function setStatus(id, status) {
    if (!hasFirebaseConfig || !db) return;
    await updateDoc(doc(db, tab, id), { status });
  }
  async function onDelete(id) {
    if (!confirm('Delete this entry?')) return;
    await deleteDoc(doc(db, tab, id));
  }

  return (
    <PageShell
      eyebrow="Admin / Story Queue"
      title="Story submissions + signups."
      kicker="Approve, reject, or flag for edits. Filter signups by source."
    >
      <div className="border-b border-ink/10 pb-4 flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setOpen(null); }}
            className={`border-b-2 pb-2 px-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
              tab === t.id ? 'border-ink text-ink' : 'border-transparent text-ash hover:text-ink'
            }`}
          >
            {t.label} · {tab === t.id ? items.length : ''}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <p className="py-6 text-ink/60">Nothing here yet.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {items.map((it) => {
              const isOpen = open === it.id;
              return (
                <li key={it.id} className="py-4">
                  <button onClick={() => setOpen(isOpen ? null : it.id)} className="grid grid-cols-12 gap-3 w-full text-left items-center">
                    <p className="col-span-12 sm:col-span-3 font-sans font-bold tracking-tight truncate">
                      {it.name || it.email || it.title || it.id}
                    </p>
                    <p className="col-span-12 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                      {it.email || it.category || it.brand || ''}
                    </p>
                    <p className="col-span-6 sm:col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                      {it.referrer || it.story || it.city || ''}
                    </p>
                    <p className="col-span-6 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em]">
                      {it.status ? (
                        <span className={`inline-block border px-2 py-0.5 ${
                          it.status === 'approved' || it.status === 'featured' ? 'border-green-700 text-green-700' :
                          it.status === 'rejected' ? 'border-red-600 text-red-600' :
                          'border-ash text-ash'
                        }`}>{it.status}</span>
                      ) : formatDate(it.createdAt)}
                    </p>
                  </button>
                  {isOpen && (
                    <div className="mt-3 border border-ink/10 p-5 bg-bone space-y-4">
                      <pre className="font-mono text-[11px] leading-relaxed text-ink/80 whitespace-pre-wrap break-words overflow-x-auto">
                        {JSON.stringify(stripTimestamps(it), null, 2)}
                      </pre>
                      {tab === 'storySubmissions' || tab === 'videoSubmissions' ? (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-ink/10">
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(it.id, s)}
                              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                                it.status === s ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
                              }`}
                            >
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                          <button onClick={() => onDelete(it.id)} className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between gap-2 pt-2 border-t border-ink/10">
                          <a href={`mailto:${it.email}`} className="btn-primary">Email →</a>
                          <button onClick={() => onDelete(it.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                            Delete
                          </button>
                        </div>
                      )}
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

function stripTimestamps(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v?.toDate ? v.toDate().toISOString() : v;
  }
  return out;
}

function formatDate(ts) {
  if (!ts?.toDate) return '—';
  try {
    return ts.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return '—'; }
}
