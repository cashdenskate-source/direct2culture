import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import StatusBadge, { statusOptions, statusLabel } from '../../components/StatusBadge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { listWhere, deleteOne } from '../../lib/firestore.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const TYPES = ['all', 'brand', 'drop', 'event', 'interview'];

export default function Submissions() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const r = await listWhere('submissions', [['ownerUid', '==', user.uid]], { orderField: 'createdAt' });
      setRows(r);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (!q) return true;
      return [r.brand, r.title, r.building, r.pitch].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [rows, search, statusFilter, typeFilter]);

  async function onDelete(id) {
    if (!confirm('Delete this draft? This cannot be undone.')) return;
    await deleteOne('submissions', id);
    await load();
  }

  return (
    <PageShell
      eyebrow="Customer / Submissions"
      title="My submissions."
      kicker="Drafts, submitted work, approved features, and editor feedback — all here."
      actions={<Link to="/dashboard/new-submission" className="btn-primary">New +</Link>}
    >
      <div className="flex flex-wrap gap-3 border-b border-ink/10 pb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search submissions"
          className="field max-w-xs"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field max-w-[200px]">
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field max-w-[200px]">
          {TYPES.map((t) => <option key={t} value={t}>{t === 'all' ? 'All Types' : capitalize(t)}</option>)}
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={rows.length ? 'No matches.' : 'No submissions yet.'}
            body={rows.length ? 'Try clearing filters.' : 'Submit something and we will see it land in editorial.'}
            action={rows.length ? null : '/dashboard/new-submission'}
            actionLabel="Submit Now →"
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {filtered.map((r) => (
              <li key={r.id} className="grid grid-cols-12 gap-4 py-5 items-start">
                <div className="col-span-12 sm:col-span-5">
                  <p className="font-sans text-lg font-bold tracking-tight">{r.brand || r.title || 'Untitled'}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{r.type} · {r.category || '—'}</p>
                  {r.building && <p className="mt-2 text-sm text-ink/70 line-clamp-2">{r.building}</p>}
                  {r.adminFeedback && (
                    <div className="mt-3 border-l-2 border-ink pl-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Editorial Feedback</p>
                      <p className="mt-1 font-serif italic text-ink/90 text-sm">“{r.adminFeedback}”</p>
                    </div>
                  )}
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <StatusBadge status={r.status || 'submitted'} />
                </div>
                <p className="col-span-6 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                  {formatDate(r.createdAt)}
                </p>
                <div className="col-span-12 sm:col-span-2 sm:text-right">
                  {r.status === 'draft' && (
                    <button onClick={() => onDelete(r.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return '—'; }
}
