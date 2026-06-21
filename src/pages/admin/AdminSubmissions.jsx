import { useEffect, useMemo, useState } from 'react';
import PageShell from '../../components/PageShell.jsx';
import StatusBadge, { statusOptions, statusLabel } from '../../components/StatusBadge.jsx';
import { listAll, updateOne, deleteOne, logActivity } from '../../lib/firestore.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const TYPES = ['all', 'brand', 'drop', 'event', 'interview'];

export default function AdminSubmissions() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [feedbackById, setFeedbackById] = useState({});

  async function load() {
    setLoading(true);
    try {
      const r = await listAll('submissions', { orderField: 'createdAt' });
      setRows(r);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (!q) return true;
      return [r.brand, r.title, r.building, r.pitch, r.ownerEmail, r.ownerName].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [rows, search, statusFilter, typeFilter]);

  async function setStatus(id, status) {
    await updateOne('submissions', id, { status, reviewedBy: user.uid });
    await logActivity(user.uid, 'submission.status', { id, status });
    await load();
  }

  async function saveFeedback(id) {
    const fb = feedbackById[id] || '';
    await updateOne('submissions', id, { adminFeedback: fb, reviewedBy: user.uid });
    await logActivity(user.uid, 'submission.feedback', { id });
    await load();
  }

  async function onDelete(id) {
    if (!confirm('Delete this submission permanently?')) return;
    await deleteOne('submissions', id);
    await load();
  }

  return (
    <PageShell
      eyebrow="Admin / Submissions"
      title="Submissions queue."
      kicker="Approve, request edits, reject, feature, or delete."
    >
      <div className="flex flex-wrap gap-3 border-b border-ink/10 pb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, content" className="field max-w-sm" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field max-w-[180px]">
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field max-w-[180px]">
          {TYPES.map((t) => <option key={t} value={t}>{t === 'all' ? 'All Types' : cap(t)}</option>)}
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink/60">No submissions match.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {filtered.map((r) => {
              const open = openId === r.id;
              return (
                <li key={r.id} className="py-5">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 sm:col-span-5">
                      <p className="font-sans text-lg font-bold tracking-tight">{r.brand || r.title || 'Untitled'}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                        {r.type} · {r.category} {r.city ? `· ${r.city}` : ''}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{r.ownerEmail}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-2"><StatusBadge status={r.status || 'submitted'} /></div>
                    <p className="col-span-6 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                      {formatDate(r.createdAt)}
                    </p>
                    <div className="col-span-12 sm:col-span-3 sm:text-right">
                      <button onClick={() => setOpenId(open ? null : r.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
                        {open ? 'Close ✕' : 'Review →'}
                      </button>
                    </div>
                  </div>

                  {open && (
                    <div className="mt-4 border border-ink/10 p-5 bg-bone">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Detail label="What they are building">{r.building || '—'}</Detail>
                        <Detail label="Why D2C should cover">{r.pitch || '—'}</Detail>
                        <Detail label="Website">{r.website || '—'}</Detail>
                        <Detail label="Instagram">{r.instagram || '—'}</Detail>
                        {r.venue && <Detail label="Venue">{r.venue}</Detail>}
                        {r.date && <Detail label="Date">{r.date}</Detail>}
                      </div>

                      <div className="mt-6">
                        <label className="field-label">Editorial feedback (visible to customer)</label>
                        <textarea
                          rows={3}
                          className="field min-h-[80px] resize-none"
                          defaultValue={r.adminFeedback || ''}
                          onChange={(e) => setFeedbackById((m) => ({ ...m, [r.id]: e.target.value }))}
                          placeholder="What needs to change, or why this is approved."
                        />
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => saveFeedback(r.id)} className="btn-ghost">Save Feedback</button>
                          <button onClick={() => setStatus(r.id, 'under_review')} className="btn-ghost">Mark Under Review</button>
                          <button onClick={() => setStatus(r.id, 'needs_edits')} className="btn-ghost">Needs Edits</button>
                          <button onClick={() => setStatus(r.id, 'approved')} className="btn-primary">Approve</button>
                          <button onClick={() => setStatus(r.id, 'featured')} className="btn-primary">Feature</button>
                          <button onClick={() => setStatus(r.id, 'rejected')} className="btn-ghost">Reject</button>
                          <button onClick={() => onDelete(r.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600 hover:underline ml-auto">
                            Delete
                          </button>
                        </div>
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

function Detail({ label, children }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <p className="text-ink/85 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return '—'; }
}
