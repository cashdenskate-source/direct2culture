import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { listAll, countCollection } from '../../lib/firestore.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    submissions: 0,
    pending: 0,
    newsletter: 0,
    messages: 0,
    drops: 0,
    events: 0,
    cultureSignals: 0,
    interviews: 0,
  });
  const [recentSubs, setRecentSubs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [allSubs, newsletter, messages, drops, events, cultureSignals, interviews] = await Promise.all([
          listAll('submissions', { orderField: 'createdAt' }).catch(() => []),
          countCollection('newsletter').catch(() => 0),
          listAll('contactMessages', { orderField: 'createdAt', max: 5 }).catch(() => []),
          countCollection('drops').catch(() => 0),
          countCollection('events').catch(() => 0),
          countCollection('cultureSignals').catch(() => 0),
          countCollection('interviews').catch(() => 0),
        ]);
        const pending = allSubs.filter((s) => ['submitted', 'under_review', 'needs_edits'].includes(s.status)).length;
        if (cancelled) return;
        setStats({
          submissions: allSubs.length,
          pending,
          newsletter,
          messages: messages.length,
          drops,
          events,
          cultureSignals,
          interviews,
        });
        setRecentSubs(allSubs.slice(0, 5));
        setRecentMessages(messages);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageShell
      eyebrow="Admin / Dashboard"
      title="Editorial overview."
      kicker="What is happening across submissions, content, newsletter, and messages."
      actions={
        <>
          <Link to="/admin/content" className="btn-ghost">Manage Content</Link>
          <Link to="/admin/submissions" className="btn-primary">View Submissions</Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Submissions" value={stats.submissions} link="/admin/submissions" />
        <StatCard label="Pending Review" value={stats.pending} link="/admin/submissions" accent />
        <StatCard label="Newsletter Subs" value={stats.newsletter} link="/admin/newsletter" />
        <StatCard label="Messages" value={stats.messages} link="/admin/messages" />
        <StatCard label="Culture Signals" value={stats.cultureSignals} link="/admin/culture-signals" />
        <StatCard label="Interviews" value={stats.interviews} link="/admin/interviews" />
        <StatCard label="Drops" value={stats.drops} link="/admin/drops" />
        <StatCard label="Events" value={stats.events} link="/admin/events" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="flex items-end justify-between border-b border-ink/10 pb-4">
            <div>
              <p className="eyebrow">Recent Submissions</p>
              <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight">Pending review queue</h2>
            </div>
            <Link to="/admin/submissions" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">View all →</Link>
          </div>
          {loading ? (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
          ) : recentSubs.length === 0 ? (
            <p className="mt-6 text-ink/60 text-sm">No submissions yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {recentSubs.map((s) => (
                <li key={s.id} className="grid grid-cols-12 gap-3 py-4 items-center">
                  <p className="col-span-12 sm:col-span-5 font-sans font-bold tracking-tight">{s.brand || s.title || 'Untitled'}</p>
                  <p className="col-span-6 sm:col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{s.type} · {s.ownerEmail}</p>
                  <div className="col-span-6 sm:col-span-2"><StatusBadge status={s.status || 'submitted'} /></div>
                  <p className="col-span-12 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                    {formatDate(s.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-5 lg:border-l lg:border-ink/15 lg:pl-10">
          <div className="flex items-end justify-between border-b border-ink/10 pb-4">
            <div>
              <p className="eyebrow">Recent Messages</p>
              <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight">Inbox</h2>
            </div>
            <Link to="/admin/messages" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">View all →</Link>
          </div>
          {loading ? (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
          ) : recentMessages.length === 0 ? (
            <p className="mt-6 text-ink/60 text-sm">No messages yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {recentMessages.slice(0, 5).map((m) => (
                <li key={m.id} className="border border-ink/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-sans font-bold tracking-tight">{m.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">{formatDate(m.createdAt)}</p>
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{m.subject}</p>
                  <p className="mt-2 text-sm text-ink/75 line-clamp-2">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function StatCard({ label, value, link, accent }) {
  const body = (
    <div className={`border p-5 transition-colors ${accent ? 'bg-ink text-bone border-ink' : 'border-ink/15 bg-bone hover:border-ink'}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${accent ? 'text-bone/60' : 'text-ash'}`}>{label}</p>
      <p className="mt-3 font-sans text-4xl font-black tracking-tightest leading-none">{value}</p>
    </div>
  );
  return link ? <Link to={link} className="block">{body}</Link> : body;
}

function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return '—'; }
}
