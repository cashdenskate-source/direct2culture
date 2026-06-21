import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { listWhere } from '../../lib/firestore.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function TypedList({ type, title, eyebrow, kicker, ctaLabel = 'Submit' }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await listWhere(
          'submissions',
          [['ownerUid', '==', user.uid], ['type', '==', type]],
          { orderField: 'createdAt' }
        );
        if (!cancelled) setRows(r);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, type]);

  return (
    <PageShell
      eyebrow={eyebrow}
      title={title}
      kicker={kicker}
      actions={
        <Link to={`/dashboard/new-submission?type=${type}`} className="btn-primary">
          {ctaLabel} +
        </Link>
      }
    >
      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title={`No ${type}s yet.`}
          body="Submit one and we will see it land in editorial review."
          action={`/dashboard/new-submission?type=${type}`}
          actionLabel={`${ctaLabel} +`}
        />
      ) : (
        <ul className="divide-y divide-ink/10">
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-12 gap-4 py-5 items-center">
              <div className="col-span-12 sm:col-span-6">
                <p className="font-sans text-lg font-bold tracking-tight">{r.brand || r.title || 'Untitled'}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                  {r.category || '—'} {r.city ? `· ${r.city}` : ''}
                </p>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <StatusBadge status={r.status || 'submitted'} />
              </div>
              <p className="col-span-6 sm:col-span-3 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {r.date || formatDate(r.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
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
