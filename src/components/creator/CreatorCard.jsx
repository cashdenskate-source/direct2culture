import { Link } from 'react-router-dom';

export default function CreatorCard({ creator }) {
  return (
    <Link
      to={`/creator/${creator.slug}`}
      className="group block border border-ink/10 bg-bone hover:border-ink transition-colors"
    >
      <div className="relative aspect-[4/5] border-b border-ink/10 overflow-hidden bg-gradient-to-br from-ink/[0.08] via-ink/[0.04] to-ink/[0.14]">
        {creator.imagePlaceholder ? (
          <img src={creator.imagePlaceholder} alt={creator.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <>
            {/* Blurred initials — anticipation / story-dropping aesthetic */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans text-[7rem] font-black tracking-tightest text-ink/40 blur-md select-none transition-all duration-700 group-hover:blur-sm group-hover:text-ink/55">
                {creator.name.split(' ').map((p) => p[0]).join('')}
              </span>
            </div>
            {/* Subtle scan-line texture */}
            <div
              className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
              }}
            />
            {/* "Story dropping" badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 bg-ink/85 backdrop-blur text-bone px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Story dropping
              </span>
            </div>
          </>
        )}
      </div>
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          {creator.category} · {creator.city}
        </p>
        <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">{creator.name}</h3>
        <p className="mt-2 text-ink/75 text-sm line-clamp-2">{creator.tagline}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink group-hover:underline">
          Meet Creator →
        </p>
      </div>
    </Link>
  );
}
