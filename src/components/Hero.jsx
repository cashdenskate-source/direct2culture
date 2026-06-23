import { Link } from 'react-router-dom';
import { trackCTA } from '../lib/tracking.js';
import Aurora from './Aurora.jsx';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-bone">
      <Aurora opacity={0.85} blur={40} />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />

      <div className="container-edge relative pt-14 pb-16 lg:pt-24 lg:pb-24">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Issue 06 / Summer 2026</p>
          <p className="eyebrow hidden md:block">Direct From The Source</p>
        </div>

        <div className="mt-12 lg:mt-16">
          <h1 className="display-xl">
            Culture<br />
            <span className="italic font-light">before</span> the<br />
            <span className="relative inline-block">
              algorithm.
              <span className="absolute -bottom-2 left-0 h-[6px] w-full bg-ink" />
            </span>
          </h1>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-xl text-ink/80 sm:text-2xl leading-snug">
              Direct2Culture documents the brands, creators, sounds, movements, and ideas
              shaping what comes next — sourced directly from the people building it.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/culture-signals" onClick={() => trackCTA('explore_culture_click')} className="btn-primary">
                Explore Culture
              </Link>
              <Link to="/submit" onClick={() => trackCTA('submit_brand_click')} className="btn-ghost">
                Submit Your Brand
              </Link>
              <Link to="/pricing" onClick={() => trackCTA('get_featured_click')} className="btn-ghost">
                Get Featured
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-ink/15 lg:pl-10">
            <p className="eyebrow">Now Documenting</p>
            <ul className="mt-4 divide-y divide-ink/10">
              {[
                ['01', 'Fashion', 'Quiet workwear, raw seams, no logos'],
                ['02', 'Music', 'Rage as the new ambient'],
                ['03', 'Skate', 'Bowl culture on camcorder'],
                ['04', 'Creators', 'The anti-vlog era'],
              ].map(([num, cat, desc]) => (
                <li key={num} className="flex items-start gap-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash mt-1">{num}</span>
                  <div>
                    <p className="font-sans font-bold tracking-tight text-ink">{cat}</p>
                    <p className="text-sm text-ink/70">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/15 bg-ink text-bone overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee ticker-track py-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5">
              {[
                'CULTURE BEFORE THE ALGORITHM',
                'CONNECTED DIRECTLY TO CULTURE',
                'BUILT FROM THE SOURCE',
                'DOCUMENTING WHAT IS NEXT',
                'SIGNAL OVER NOISE',
                'INDEPENDENT BY DESIGN',
              ].map((t) => (
                <span key={t + i} className="font-mono text-[11px] uppercase tracking-[0.3em] flex items-center gap-10">
                  {t}
                  <span className="inline-block h-1 w-1 rounded-full bg-bone" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
