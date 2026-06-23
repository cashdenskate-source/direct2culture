import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { DailyLawFull } from '../components/DailyLaw.jsx';
import { dailyLaws, todaysLaw } from '../data/dailyLaws.js';

export default function Today() {
  const today = new Date();
  const { index } = todaysLaw(today);

  // Preview the next 3 upcoming laws so visitors see this is a real calendar.
  const upcoming = [1, 2, 3].map((offset) => {
    const i = (index + offset) % dailyLaws.length;
    return dailyLaws[i];
  });

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

        <div className="mt-16 border-t border-ink/10 pt-10">
          <p className="eyebrow">Coming up</p>
          <ul className="mt-6 divide-y divide-ink/10 border border-ink/15">
            {upcoming.map((entry, i) => (
              <li key={entry.law} className="flex items-baseline gap-5 px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash shrink-0 w-12">
                  +{i + 1}d
                </span>
                <span className="font-sans text-base text-ink/85">{entry.law}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            One Law. Every day. Forever.
          </p>
        </div>

        <div className="mt-12 border-t border-ink/10 pt-10">
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
