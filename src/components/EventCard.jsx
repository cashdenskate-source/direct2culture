import Card, { ImagePlaceholder } from './Card.jsx';

function formatDate(d) {
  try {
    const date = new Date(d);
    return {
      day: date.toLocaleDateString('en-US', { day: '2-digit' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    };
  } catch {
    return { day: '--', month: '---', year: '----' };
  }
}

export default function EventCard({ event }) {
  const { day, month, year } = formatDate(event.date);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{event.accent}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink">{event.city}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col items-start justify-center border border-ink/15 p-4">
          <p className="font-sans text-5xl font-black tracking-tightest leading-none">{day}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{month} · {year}</p>
        </div>
        <div className="col-span-2">
          <ImagePlaceholder accent={event.city} label={event.city} ratio="frame" />
        </div>
      </div>

      <h3 className="mt-6 font-sans text-2xl font-bold tracking-tight">{event.name}</h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{event.venue}</p>
      <p className="mt-3 text-ink/70 text-[15px] leading-relaxed">{event.description}</p>

      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">FREE · RSVP REQUIRED</span>
        <button className="btn-primary">RSVP</button>
      </div>
    </Card>
  );
}
