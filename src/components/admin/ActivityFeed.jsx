import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';

const SOURCES = [
  { coll: 'users', icon: '🟢', label: 'signed up', linkBase: '/admin/users', titleFrom: (d) => d.name || d.email, subFrom: (d) => `${d.userType || 'fan'} · ${d.email}` },
  { coll: 'contactMessages', icon: '📩', label: 'sent a message', linkBase: '/admin/messages', titleFrom: (d) => d.name, subFrom: (d) => d.subject || d.email },
  { coll: 'submissions', icon: '🎯', label: 'submitted', linkBase: '/admin/submissions', titleFrom: (d) => d.brand || d.title || 'Untitled', subFrom: (d) => `${d.type || 'submission'} · ${d.ownerEmail || ''}` },
  { coll: 'releases', icon: '🎤', label: 'queued a release', linkBase: '/admin/releases', titleFrom: (d) => d.title, subFrom: (d) => `${d.artistName} · ${d.type} · ${d.status}` },
  { coll: 'newsletter', icon: '📰', label: 'joined newsletter', linkBase: '/admin/newsletter', titleFrom: (d) => d.email, subFrom: () => 'newsletter signup' },
];

const PAGE = 25;

export default function ActivityFeed() {
  const [streams, setStreams] = useState({});
  const [visible, setVisible] = useState(PAGE);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    const unsubs = SOURCES.map((src) => {
      const q = query(collection(db, src.coll), orderBy('createdAt', 'desc'), limit(50));
      return onSnapshot(
        q,
        (snap) => {
          setStreams((s) => ({
            ...s,
            [src.coll]: snap.docs.map((d) => ({ id: d.id, _coll: src.coll, ...d.data() })),
          }));
        },
        () => setStreams((s) => ({ ...s, [src.coll]: [] })),
      );
    });
    return () => unsubs.forEach((u) => u());
  }, []);

  const merged = useMemo(() => {
    const all = [];
    for (const list of Object.values(streams)) all.push(...list);
    all.sort((a, b) => {
      const ta = (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
      const tb = (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
      return tb - ta;
    });
    return all;
  }, [streams]);

  const shown = merged.slice(0, visible);

  return (
    <div>
      <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
        <h2 className="font-sans text-2xl font-black tracking-tight">Activity</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          <span className="inline-block h-2 w-2 mr-2 rounded-full bg-green-500 animate-pulse" />
          live · {merged.length} total
        </p>
      </div>
      {shown.length === 0 ? (
        <p className="py-6 text-ink/60 text-sm">No activity yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {shown.map((item) => {
            const src = SOURCES.find((s) => s.coll === item._coll);
            if (!src) return null;
            return (
              <li key={`${item._coll}_${item.id}`} className="py-3">
                <Link to={src.linkBase} className="flex items-start gap-3 hover:bg-ink/[0.03] -mx-2 px-2 py-1 transition-colors">
                  <span className="text-base shrink-0 leading-snug">{src.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-sans font-bold tracking-tight">{src.titleFrom(item)}</span>
                      <span className="text-ash"> {src.label}</span>
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                      {src.subFrom(item)}
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                    {timeAgo(item.createdAt)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {visible < merged.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setVisible((v) => v + PAGE)} className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone">
            Load {Math.min(PAGE, merged.length - visible)} more →
          </button>
        </div>
      )}
    </div>
  );
}

function timeAgo(ts) {
  if (!ts?.toMillis) return '—';
  const diff = Date.now() - ts.toMillis();
  if (diff < 60_000) return 'now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ts.toMillis()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
