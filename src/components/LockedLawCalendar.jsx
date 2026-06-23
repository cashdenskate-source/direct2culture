import { pad, useCountdown } from '../hooks/useCountdown.js';

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function dayLabel(date) {
  return date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();
}

// Midnight at the START of the day `offset` days from today (local time).
function midnightAfter(offset) {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + offset,
    0,
    0,
    0,
    0
  );
}

function CalendarCell({ offset }) {
  const isToday = offset === 0;
  const target = midnightAfter(offset);
  const { days, hours, minutes, done } = useCountdown(isToday ? null : target);

  return (
    <div
      className={`border p-4 ${
        isToday
          ? 'border-ink bg-ink text-bone'
          : 'border-ink/15 bg-bone text-ink'
      }`}
    >
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
          isToday ? 'text-bone/60' : 'text-ash'
        }`}
      >
        {dayLabel(target)}
      </p>
      <div className="mt-3 flex h-5 items-center">
        {isToday ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone font-bold">
            Today
          </span>
        ) : (
          <LockIcon />
        )}
      </div>
      <p
        className={`mt-3 font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums ${
          isToday ? 'text-bone/60' : 'text-ash'
        }`}
      >
        {isToday
          ? 'Unlocked'
          : done
            ? 'Open'
            : days > 0
              ? `${days}d ${pad(hours)}h`
              : `${pad(hours)}h ${pad(minutes)}m`}
      </p>
    </div>
  );
}

export default function LockedLawCalendar({ days = 7 }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
      {Array.from({ length: days }, (_, i) => (
        <CalendarCell key={i} offset={i} />
      ))}
    </div>
  );
}
