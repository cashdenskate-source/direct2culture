export default function Card({ children, className = '', as: Tag = 'article' }) {
  return <Tag className={`card hover-lift ${className}`}>{children}</Tag>;
}

export function ImagePlaceholder({ label, ratio = 'frame', accent }) {
  const cls = ratio === 'wide' ? 'image-frame-wide' : 'image-frame';
  return (
    <div className={`${cls} group`}>
      <div className="absolute inset-0 image-noise opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-smoke to-ink/80" />
      <div className="absolute inset-0 flex items-end justify-between p-4 sm:p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
          {accent || 'IMG / PLACEHOLDER'}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
          D2C
        </span>
      </div>
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex h-2 w-2 items-center">
        <span className="block h-2 w-2 rounded-full bg-bone" />
      </div>
      {label && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6">
          <p className="font-sans font-black tracking-tightest text-bone/95 text-3xl sm:text-4xl leading-[0.9]">
            {label}
          </p>
        </div>
      )}
      <div className="absolute inset-0 ring-0 ring-bone/0 group-hover:ring-1 group-hover:ring-bone/30 transition-all duration-500" />
    </div>
  );
}
