import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';

export default function Art() {
  return (
    <>
      <SEO title="Art Market | Culture Stock Exchange" description="Visual artists charted like stocks — coming soon." />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow="Direct2Culture / Art"
          title="Art Stock Exchange."
          kicker="Painters, photographers, designers, illustrators — tracked like assets. Currently in build."
        />

        <div className="mt-12 border border-ink/10 p-10 bg-ink/5 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Status</p>
          <h2 className="mt-2 font-sans text-3xl font-black tracking-tight">Coming Soon.</h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            The Art Market will let visual artists list works, track sales/saves, and chart growth — same architecture as the Music and Brand exchanges.
            Want to be one of the first artists listed? Submit your work and we'll feature you when the market opens.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/submit" className="btn-primary">Submit Work →</Link>
            <Link to="/market" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink self-center">
              ← Back to Music Market
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
