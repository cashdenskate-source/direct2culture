import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import StatTile from '../../components/StatTile.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { listWhere } from '../../lib/firestore.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Overview() {
  const { user, profile } = useAuth();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await listWhere('submissions', [['ownerUid', '==', user.uid]], { orderField: 'createdAt', max: 50 });
        if (!cancelled) setSubs(rows);
      } catch {
        if (!cancelled) setSubs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const counts = subs.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
  const total = subs.length;
  const approved = counts.approved || 0;
  const featured = counts.featured || 0;
  const pending = (counts.submitted || 0) + (counts.under_review || 0);

  return (
    <PageShell
      eyebrow="Customer / Overview"
      title={`Welcome, ${profile?.name?.split(' ')[0] || 'creator'}.`}
      kicker="Submit your work, track status, and respond to editorial feedback — all in one place."
      actions={<Link to="/dashboard/new-submission" className="btn-primary">New Submission +</Link>}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Total Submissions" value={total} />
        <StatTile label="Pending" value={pending} />
        <StatTile label="Approved" value={approved} />
        <StatTile label="Featured" value={featured} accent />
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between border-b border-ink/10 pb-4">
          <div>
            <p className="eyebrow">Recent Activity</p>
            <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight">Latest submissions</h2>
          </div>
          <Link to="/dashboard/submissions" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
            View all →
          </Link>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
          ) : subs.length === 0 ? (
            <EmptyState
              title="No submissions yet."
              body="Submit a brand, drop, event, or interview request to get on the editorial radar."
              action="/dashboard/new-submission"
              actionLabel="Submit Now →"
            />
          ) : (
            <ul className="divide-y divide-ink/10">
              {subs.slice(0, 5).map((s) => (
                <li key={s.id} className="grid grid-cols-12 gap-4 py-4 items-center">
                  <p className="col-span-12 sm:col-span-5 font-sans font-bold tracking-tight">{s.brand || s.title || 'Untitled'}</p>
                  <p className="col-span-6 sm:col-span-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">{s.type}</p>
                  <div className="col-span-6 sm:col-span-2">
                    <StatusBadge status={s.status || 'submitted'} />
                  </div>
                  <p className="col-span-12 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                    {formatDate(s.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <QuickAction to="/dashboard/new-submission?type=drop" eyebrow="Submit" title="Add a drop." />
        <QuickAction to="/dashboard/new-submission?type=event" eyebrow="Submit" title="Add an event." />
        <QuickAction to="/dashboard/interview-request" eyebrow="Request" title="Request an interview." />
      </div>
    </PageShell>
  );
}

function QuickAction({ to, eyebrow, title }) {
  return (
    <Link to={to} className="group border border-ink/15 p-6 hover:border-ink transition-colors block">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-3 font-sans text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash group-hover:text-ink">Go →</p>
    </Link>
  );
}

function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return '—'; }
}
