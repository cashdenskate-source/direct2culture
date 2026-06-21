import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import Countdown from '../../components/market/Countdown.jsx';
import { subscribeApprovedUpcoming, presaveRelease, hasPresaved } from '../../lib/releases.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Upcoming() {
  const [releases, setReleases] = useState([]);
  const [presaved, setPresaved] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeApprovedUpcoming(setReleases);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) { setPresaved({}); return; }
    let cancelled = false;
    (async () => {
      const map = {};
      for (const r of releases) {
        map[r.id] = await hasPresaved(r.id, user.uid);
      }
      if (!cancelled) setPresaved(map);
    })();
    return () => { cancelled = true; };
  }, [releases, user]);

  async function onPresave(release) {
    if (!user) {
      navigate('/signup', { state: { from: '/market/upcoming' } });
      return;
    }
    await presaveRelease(release.id, user);
    setPresaved((p) => ({ ...p, [release.id]: true }));
  }

  return (
    <>
      <SEO title="Upcoming Releases | Culture Stock Exchange" description="Pre-save upcoming drops from the next wave of artists. Tapes, singles, albums — see them before they hit." />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Market / Upcoming"
          title="Drops on deck."
          kicker="Tapes, singles, albums coming soon. Pre-save now — we'll ping you the second it drops."
        />

        <div className="mt-12 space-y-8">
          {releases.length === 0 ? (
            <p className="text-ink/60">Nothing on the schedule yet. Check back soon.</p>
          ) : (
            releases.map((r) => (
              <article key={r.id} className="border border-ink/10 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                <div className="aspect-square bg-ink/5 border border-ink/10 overflow-hidden">
                  {r.coverURL ? (
                    <img src={r.coverURL} alt={r.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                      {r.type || 'release'}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                    {r.type || 'release'} · {r.artistName}
                  </p>
                  <h2 className="mt-2 font-sans text-3xl lg:text-4xl font-black tracking-tightest">{r.title}</h2>
                  {r.description && <p className="mt-3 text-ink/80 leading-relaxed max-w-2xl">{r.description}</p>}

                  <div className="mt-6">
                    <p className="eyebrow">Drops in</p>
                    <div className="mt-1"><Countdown to={r.releaseDate} /></div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onPresave(r)}
                      disabled={presaved[r.id]}
                      className={`px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                        presaved[r.id] ? 'bg-green-700 text-white cursor-default' : 'bg-ink text-bone hover:opacity-90'
                      }`}
                    >
                      {presaved[r.id] ? '✓ Pre-Saved' : 'Pre-Save →'}
                    </button>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                      {r.presaveCount || 0} fans waiting
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-12">
          <Link to="/market" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
            ← Back to Market
          </Link>
        </div>
      </div>
    </>
  );
}
