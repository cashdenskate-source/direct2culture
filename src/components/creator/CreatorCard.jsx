import { Link } from 'react-router-dom';

export default function CreatorCard({ creator }) {
  return (
    <Link
      to={`/creator/${creator.slug}`}
      className="group block border border-ink/10 bg-bone hover:border-ink transition-colors"
    >
      <div className="aspect-[4/5] bg-ink/5 border-b border-ink/10 overflow-hidden">
        {creator.imagePlaceholder ? (
          <img src={creator.imagePlaceholder} alt={creator.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-sans text-6xl font-black tracking-tightest text-ink/15">
              {creator.name.split(' ').map((p) => p[0]).join('')}
            </span>
          </div>
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
