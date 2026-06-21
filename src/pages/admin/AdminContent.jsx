import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { listAll } from '../../lib/firestore.js';

const sections = [
  { key: 'cultureSignals', label: 'Culture Signals', to: '/admin/culture-signals', kicker: 'Trends, fashion, music, skate, internet movements.' },
  { key: 'interviews', label: 'Interviews', to: '/admin/interviews', kicker: 'Founders, artists, designers, creators.' },
  { key: 'drops', label: 'Drops', to: '/admin/drops', kicker: 'Fashion, music, merch, digital, events.' },
  { key: 'events', label: 'Events', to: '/admin/events', kicker: 'Listening parties, showrooms, sessions, screenings.' },
];

export default function AdminContent() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = {};
      for (const s of sections) {
        try {
          const rows = await listAll(s.key, { orderField: 'createdAt' });
          result[s.key] = {
            total: rows.length,
            published: rows.filter((r) => r.status === 'published' || r.status === 'featured').length,
            featured: rows.filter((r) => r.status === 'featured').length,
            drafts: rows.filter((r) => !r.status || r.status === 'draft').length,
          };
        } catch {
          result[s.key] = { total: 0, published: 0, featured: 0, drafts: 0 };
        }
      }
      if (!cancelled) setCounts(result);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageShell
      eyebrow="Admin / Content"
      title="Content overview."
      kicker="Manage the four content types that power the public site."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((s) => {
          const c = counts[s.key] || {};
          return (
            <Link key={s.key} to={s.to} className="group border border-ink/15 p-6 hover:border-ink transition-colors block">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">{s.label}</p>
                  <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight">{c.total ?? '—'} items</h3>
                  <p className="mt-2 text-ink/70 text-sm">{s.kicker}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash group-hover:text-ink">Manage →</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
                <Mini label="Published" value={c.published ?? 0} />
                <Mini label="Featured" value={c.featured ?? 0} />
                <Mini label="Drafts" value={c.drafts ?? 0} />
              </div>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-1 font-sans text-2xl font-black tracking-tightest leading-none">{value}</p>
    </div>
  );
}
