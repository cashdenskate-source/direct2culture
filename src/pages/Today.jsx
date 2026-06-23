import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { DailyLawFull } from '../components/DailyLaw.jsx';
import LockedLawCalendar from '../components/LockedLawCalendar.jsx';
import { pad, useCountdown } from '../hooks/useCountdown.js';

function NextUnlockCountdown() {
  const now = new Date();
  const tomorrowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const { hours, minutes, seconds, done } = useCountdown(tomorrowMidnight);
  if (done) return null;
  return (
    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
      Next Law unlocks in{' '}
      <span className="font-bold tabular-nums text-ink">
        {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    </p>
  );
}

export default function Today() {
  return (
    <>
      <Helmet>
        <title>Today's Law — Direct2Culture</title>
        <meta
          name="description"
          content="A new Law of Culture every day. Direct2Culture."
        />
      </Helmet>

      <section className="container-edge py-16 lg:py-24">
        <DailyLawFull />
        <NextUnlockCountdown />

        <div className="mt-16 border-t border-ink/10 pt-10">
          <p className="eyebrow">Coming up</p>
          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight">
            The next seven Laws.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink/70">
            Locked until each day arrives. One Law a day. No skipping ahead.
          </p>
          <div className="mt-6">
            <LockedLawCalendar days={7} />
          </div>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-10">
          <p className="eyebrow">Want it in your inbox?</p>
          <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight">
            Subscribe to The Culture Brief.
          </h3>
          <p className="mt-3 max-w-xl text-sm text-ink/70">
            Today's Law leads every issue of The Culture Brief, alongside the
            week's signals, drops, and creators.
          </p>
          <Link to="/newsletter" className="btn-primary mt-6">
            Get The Culture Brief →
          </Link>
        </div>
      </section>
    </>
  );
}
