import Card, { ImagePlaceholder } from './Card.jsx';

export default function InterviewCard({ interview, index }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          {interview.accent || `IV / ${String(index + 1).padStart(2, '0')}`}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink">
          {interview.location}
        </span>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent={interview.name} label={interview.name.split(' ').map((n) => n[0]).join('')} />
      </div>

      <div className="mt-6">
        <h3 className="font-sans text-2xl font-bold tracking-tight">{interview.name}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{interview.role}</p>
      </div>

      <blockquote className="mt-5 border-l-2 border-ink pl-4 font-serif italic text-ink/90 text-[17px] leading-snug">
        “{interview.quote}”
      </blockquote>

      <div className="mt-auto flex items-center justify-end pt-6">
        <button className="font-mono text-[11px] uppercase tracking-[0.2em] hover:underline">
          Read Interview →
        </button>
      </div>
    </Card>
  );
}
