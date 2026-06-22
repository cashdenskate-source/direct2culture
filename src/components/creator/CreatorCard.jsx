import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CreatorCard({ creator }) {
  const isUnrevealed = creator.isRevealed === false;

  return (
    <Link
      to={`/creator/${creator.slug}`}
      className="group block border border-ink/10 bg-bone hover:border-ink transition-colors"
    >
      <div className="relative aspect-[4/5] border-b border-ink/10 overflow-hidden bg-gradient-to-br from-ink/[0.08] via-ink/[0.04] to-ink/[0.14]">
        {creator.imagePlaceholder && !isUnrevealed ? (
          <img src={creator.imagePlaceholder} alt={creator.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans text-[7rem] font-black tracking-tightest text-ink/40 blur-md select-none transition-all duration-700 group-hover:blur-sm group-hover:text-ink/55">
                {creator.name.split(' ').map((p) => p[0]).join('')}
              </span>
            </div>
            <div
              className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
              }}
            />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 bg-ink/85 backdrop-blur text-bone px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em]">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${isUnrevealed ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`} />
                {isUnrevealed ? 'Countdown' : 'Story dropping'}
              </span>
            </div>
            {isUnrevealed && creator.storyDebutDate && (
              <div className="absolute bottom-0 left-0 right-0 bg-ink/85 backdrop-blur text-bone px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-bone/60">Debuts in</p>
                <CountdownTiny to={creator.storyDebutDate} />
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          {creator.category} · {creator.city}
        </p>
        <h3 className="mt-2 font-sans text-2xl font-black tracking-tight blur-[6px] select-none transition-all duration-500 group-hover:blur-[1.5px]">
          {isUnrevealed ? (creator.blurredName || creator.name) : creator.name}
        </h3>
        <p className="mt-2 text-ink/75 text-sm line-clamp-2 blur-[4px] select-none transition-all duration-500 group-hover:blur-[1px]">
          {isUnrevealed ? creator.teaserText : creator.tagline}
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink group-hover:underline">
          {isUnrevealed ? 'Notify Me →' : 'Reveal Creator →'}
        </p>
      </div>
    </Link>
  );
}

function CountdownTiny({ to }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(to).getTime();
  const diff = Math.max(0, target - now);
  if (diff === 0) return <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green-400">Out now</span>;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  return (
    <p className="font-mono text-[11px] tabular-nums text-bone">
      {String(d).padStart(2, '0')}d {String(h).padStart(2, '0')}h {String(m).padStart(2, '0')}m
    </p>
  );
}
