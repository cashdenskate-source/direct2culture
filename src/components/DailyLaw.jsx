import { Link } from 'react-router-dom';
import { todaysLaw } from '../data/dailyLaws.js';

function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

// Compact ribbon for the homepage. Shows today's law + date + permalink.
export function DailyLawRibbon() {
  const today = new Date();
  const { law } = todaysLaw(today);
  return (
    <section className="border-y border-ink/10 bg-ink text-bone">
      <div className="container-edge py-5 lg:py-6">
        <Link
          to="/today"
          className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-5 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 shrink-0">
              Today's Law · {formatDate(today)}
            </p>
            <p className="font-sans text-base md:text-lg font-bold tracking-tight text-bone truncate">
              {law}
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 group-hover:text-bone shrink-0">
            Read today →
          </span>
        </Link>
      </div>
    </section>
  );
}

// Full expansion for the /today page.
export function DailyLawFull() {
  const today = new Date();
  const { law, body, source } = todaysLaw(today);
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
        Today's Law · {formatDate(today)}
      </p>
      <h1 className="display-lg mt-4">{law}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">{body}</p>
      {source && (
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          {source} · Robert Greene
        </p>
      )}
    </div>
  );
}
