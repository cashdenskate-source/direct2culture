import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import StatTile from '../../components/admin/StatTile.jsx';
import ActivityFeed from '../../components/admin/ActivityFeed.jsx';
import MarketIndex from '../../components/market/MarketIndex.jsx';
import Countdown from '../../components/market/Countdown.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';

const COLLECTIONS = ['users', 'songs', 'artists', 'brands', 'releases', 'contactMessages', 'newsletter', 'submissions'];

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const [counts, setCounts] = useState({});
  const [recentSignups, setRecentSignups] = useState([]);
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  const [pendingReleases, setPendingReleases] = useState(0);

  // Live counts per collection
  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    const unsubs = COLLECTIONS.map((c) =>
      onSnapshot(
        collection(db, c),
        (snap) => setCounts((p) => ({ ...p, [c]: snap.size })),
        () => setCounts((p) => ({ ...p, [c]: 0 })),
      ),
    );
    return () => unsubs.forEach((u) => u());
  }, []);

  // Latest sign-ups
  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      setRecentSignups(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Approved upcoming + pending count
  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    const unsubA = onSnapshot(
      query(collection(db, 'releases'), orderBy('releaseDate', 'asc')),
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUpcomingReleases(all.filter((r) => r.status === 'approved').slice(0, 3));
        setPendingReleases(all.filter((r) => r.status === 'pending').length);
      },
    );
    return () => unsubA();
  }, []);

  const greet = greeting();
  const name = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'editor';

  return (
    <PageShell
      eyebrow="Admin / Dashboard"
      title={`${greet}, ${name}.`}
      kicker="Live overview of sign-ups, market activity, releases, and messages."
    >
      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Sign-Ups" value={counts.users || 0} to="/admin/users" rate={3} accent />
        <StatTile label="Songs" value={counts.songs || 0} to="/admin/market" />
        <StatTile label="Brands" value={counts.brands || 0} to="/admin/brands-market" />
        <StatTile label="Releases" value={counts.releases || 0} to="/admin/releases" />
        <StatTile label="Messages" value={counts.contactMessages || 0} to="/admin/messages" />
        <StatTile label="Newsletter" value={counts.newsletter || 0} to="/admin/newsletter" />
      </div>

      {/* Two-column layout: Activity feed (left) + Sidebar widgets (right) */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        <aside className="space-y-10">
          {/* Latest sign-ups widget */}
          <div>
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-3">
              <h3 className="font-sans text-lg font-black tracking-tight">Latest Sign-Ups</h3>
              <Link to="/admin/users" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">View all →</Link>
            </div>
            {recentSignups.length === 0 ? (
              <p className="py-4 text-ink/60 text-sm">No sign-ups yet.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {recentSignups.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.25em] text-ash">
                          {(u.name || u.email || '?').slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-sm truncate">{u.name || '—'}</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash truncate">{u.email}</p>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] border border-ink/30 px-1.5 py-0.5">
                      {u.userType || 'fan'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Upcoming releases widget */}
          <div>
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-3">
              <h3 className="font-sans text-lg font-black tracking-tight">Upcoming Drops</h3>
              <Link to="/admin/releases" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">Manage →</Link>
            </div>
            {upcomingReleases.length === 0 ? (
              <p className="py-4 text-ink/60 text-sm">No approved upcoming drops.</p>
            ) : (
              <ul className="space-y-4">
                {upcomingReleases.map((r) => (
                  <li key={r.id} className="border border-ink/10 p-3">
                    <p className="font-sans font-bold tracking-tight truncate">{r.title}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash truncate">{r.artistName} · {r.type}</p>
                    <div className="mt-2"><Countdown to={r.releaseDate} /></div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick actions */}
          <div>
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-3">
              <h3 className="font-sans text-lg font-black tracking-tight">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Link to="/admin/market" className="block border border-ink/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone transition-colors">
                + Add Song →
              </Link>
              <Link to="/admin/brands-market" className="block border border-ink/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone transition-colors">
                + Add Brand →
              </Link>
              <Link to="/admin/releases" className={`block border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                pendingReleases > 0 ? 'border-ink bg-ink text-bone' : 'border-ink/15 hover:bg-ink hover:text-bone'
              }`}>
                {pendingReleases > 0 ? `⚡ Approve ${pendingReleases} Pending` : 'Releases →'}
              </Link>
              <Link to="/admin/messages" className="block border border-ink/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone transition-colors">
                Inbox →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Market snapshots */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketIndex
          title="D2C Music Index"
          subtitle="aggregate streams"
          collectionName="streamHistory"
          valueField="streams"
          height={180}
        />
        <MarketIndex
          title="D2C Brand Index"
          subtitle="aggregate followers"
          collectionName="brandHistory"
          valueField="followers"
          height={180}
        />
      </div>
    </PageShell>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
