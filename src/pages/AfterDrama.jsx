import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { afterDramaArticles } from '../data/afterDramaData.js';

export default function AfterDrama() {
  return (
    <>
      <SEO
        title="AfterDrama | Direct2Culture"
        description="How culture turns into business. AfterDrama is the education vertical for founders, brands, makeup brands, creators, and entrepreneurs."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="AfterDrama x Direct2Culture"
          title="AfterDrama."
          kicker="How culture turns into business. The education vertical for founders, brands, makeup brands, creators, and entrepreneurs."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {afterDramaArticles.map((a) => (
            <Link
              key={a.id}
              to={`/afterdrama/${a.slug}`}
              className="group block border border-ink/10 p-8 bg-bone hover:border-ink transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{a.category}</p>
              <h3 className="mt-3 font-sans text-3xl font-black tracking-tightest">{a.title}</h3>
              <p className="mt-3 text-ink/75 leading-relaxed">{a.excerpt}</p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink group-hover:underline">Read →</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">AfterDrama.com</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">More on the dedicated site.</h3>
          <p className="mt-3 text-ink/80 max-w-2xl">The full AfterDrama archive lives at its own home. Coming soon.</p>
          <a href="https://afterdrama.com" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block btn-primary">Explore AfterDrama →</a>
        </div>
      </div>
    </>
  );
}
