import Card, { ImagePlaceholder } from './Card.jsx';

export default function CultureSignalCard({ signal, index }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          {signal.accent || `CS / ${String(index + 1).padStart(2, '0')}`}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink">
          {signal.category}
        </span>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent={signal.category} label={signal.category} ratio="wide" />
      </div>

      <h3 className="mt-6 font-sans text-2xl font-bold tracking-tight leading-[1.05]">
        {signal.title}
      </h3>
      <p className="mt-3 text-ink/70 text-[15px] leading-relaxed">{signal.description}</p>

      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{signal.date}</span>
        <button className="font-mono text-[11px] uppercase tracking-[0.2em] hover:underline">
          Read More →
        </button>
      </div>
    </Card>
  );
}
