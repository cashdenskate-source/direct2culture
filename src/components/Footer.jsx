import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm.jsx';

export default function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="container-edge py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-bone/50">D2C / Manifest</p>
            <h2 className="mt-4 display-lg">
              Culture before<br />the algorithm.
            </h2>
            <p className="mt-6 max-w-md text-bone/70 text-lg">
              Direct2Culture documents what culture actually looks like, before it becomes mainstream.
              Independent brands. Underground creators. The signal underneath the noise.
            </p>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow text-bone/50">D2C / The Culture Brief</p>
            <h3 className="mt-4 font-sans text-2xl font-bold tracking-tighter">
              The Culture Brief.
            </h3>
            <p className="mt-3 text-bone/60 text-sm">
              Weekly. Artists, brands, creators, drops, events, culture signals. Skip the filler.
            </p>
            <div className="mt-6">
              <NewsletterForm variant="dark" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow text-bone/50">D2C / Index</p>
            <ul className="mt-4 space-y-3 font-sans text-base">
              <li><Link to="/identity-graph" className="hover:text-bone text-bone/70">Identity Graph</Link></li>
              <li><Link to="/culture-signals" className="hover:text-bone text-bone/70">Culture Signals</Link></li>
              <li><Link to="/interviews" className="hover:text-bone text-bone/70">Interviews</Link></li>
              <li><Link to="/drops" className="hover:text-bone text-bone/70">Drops</Link></li>
              <li><Link to="/events" className="hover:text-bone text-bone/70">Events</Link></li>
              <li><Link to="/submit" className="hover:text-bone text-bone/70">Submit Your Brand</Link></li>
              <li><Link to="/market" className="hover:text-bone text-bone/70">Market</Link></li>
              <li><Link to="/pricing" className="hover:text-bone text-bone/70">Get Featured</Link></li>
              <li><Link to="/newsletter" className="hover:text-bone text-bone/70">The Culture Brief</Link></li>
              <li><Link to="/stories" className="hover:text-bone text-bone/70">Stories</Link></li>
              <li><Link to="/creators" className="hover:text-bone text-bone/70">Creators</Link></li>
              <li><Link to="/tell-your-story" className="hover:text-bone text-bone/70">Tell Your Story</Link></li>
              <li><Link to="/contact" className="hover:text-bone text-bone/70">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-bone/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow text-bone/50">Instagram</p>
            <a href="https://instagram.com/direct2culture" target="_blank" rel="noreferrer" className="mt-2 block font-sans text-lg font-medium hover:opacity-70">
              @direct2culture →
            </a>
          </div>
          <div>
            <p className="eyebrow text-bone/50">TikTok</p>
            <a href="https://tiktok.com/@direct2culture" target="_blank" rel="noreferrer" className="mt-2 block font-sans text-lg font-medium hover:opacity-70">
              @direct2culture →
            </a>
          </div>
          <div>
            <p className="eyebrow text-bone/50">YouTube</p>
            <a href="https://youtube.com/@direct2culture" target="_blank" rel="noreferrer" className="mt-2 block font-sans text-lg font-medium hover:opacity-70">
              /direct2culture →
            </a>
          </div>
          <div>
            <p className="eyebrow text-bone/50">Press</p>
            <a href="mailto:press@direct2culture.com" className="mt-2 block font-sans text-lg font-medium hover:opacity-70">
              press@direct2culture.com →
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-sans font-black tracking-tightest leading-none text-[18vw] sm:text-[12vw] lg:text-[9vw] text-bone/95 select-none">
            DIRECT2CULTURE
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-bone/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
            © {new Date().getFullYear()} Direct2Culture · All rights reserved
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/terms" className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 hover:text-bone">Terms</Link>
            <Link to="/privacy" className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 hover:text-bone">Privacy</Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
              direct2culture.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
