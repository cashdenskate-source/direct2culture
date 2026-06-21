export default function BrandCard({ brand, index, label = 'BRAND' }) {
  return (
    <article className="group relative border-t border-ink/20 py-6 transition-colors hover:bg-ink hover:text-bone hover:border-ink">
      <div className="container-edge flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 sm:gap-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60 w-8">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight">{brand.name}</h3>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{brand.city}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{brand.category || brand.craft}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-90 group-hover:underline">
            {label} →
          </span>
        </div>
        <span className="md:hidden font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
          {brand.category || brand.craft}
        </span>
      </div>
    </article>
  );
}
