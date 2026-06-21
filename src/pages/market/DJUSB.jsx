import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';

export default function DJUSB() {
  return (
    <>
      <SEO title="D2C DJ USB | Direct2Culture" description="The Direct2Culture DJ USB — a curated USB drop, refreshed monthly, only for trusted DJs." />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-16 max-w-3xl">
        <PageHeader
          eyebrow="Direct2Culture / DJ USB"
          title="The D2C DJ USB."
          kicker="A curated USB drop. Refreshed monthly. Only for trusted DJs on the Culture Exchange."
        />

        <div className="mt-10 space-y-8 text-ink/85 leading-relaxed">
          <Section title="The concept">
            Streaming platforms gate culture behind algorithms. DJs don't.
            The D2C DJ USB ships every month with the underground tracks the algorithm hasn't found yet —
            curated from artists submitted to Direct2Culture.
          </Section>

          <Section title="What's on it">
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>40-60 unreleased + early-release tracks from D2C-submitted artists</li>
              <li>320kbps WAVs + MP3s, ready to drop in Serato / Rekordbox</li>
              <li>Liner notes — who's making this, where they're from, what's coming next</li>
              <li>One physical drop per month + monthly digital refresh</li>
            </ul>
          </Section>

          <Section title="Who gets one">
            Verified DJs on the D2C DJ Market with proven spin history. We're shipping the first batch to influence
            scores 80+. To be considered, register on the DJ Market and start logging your spins.
          </Section>

          <Section title="What it costs">
            The first batch ships free to verified DJs. After that, a small annual fee covers production +
            shipping. Monetization is artist-side via featured placement and label partnerships — not from the DJs spinning it.
          </Section>

          <Section title="What we ask in return">
            Log your spins on direct2culture.com. That data builds the chart. The artists you put on get their flowers.
            Culture moves forward.
          </Section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/dashboard/submit-dj" className="btn-primary">Apply to be a D2C DJ →</Link>
          <Link to="/market/djs" className="border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">View DJ Market →</Link>
        </div>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          Concept page · physical USB launching soon. Apply now to be considered for the first run.
        </p>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-sans text-2xl font-black tracking-tight">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
