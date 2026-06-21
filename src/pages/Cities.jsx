import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { cities } from '../data/cityData.js';

export default function Cities() {
  return (
    <>
      <SEO title="City Rankings | Direct2Culture" description="Culture rankings by city — Los Angeles, Atlanta, Miami, New York, London." />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Cities"
          title="City rankings."
          kicker="Where culture is moving. Top artists, DJs, brands, creatives, and events — by city."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {cities.map((c) => (
            <Link
              key={c.slug}
              to={`/cities/${c.slug}`}
              className="border border-ink/15 p-8 hover:bg-ink hover:text-bone hover:border-ink transition-colors group"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">{c.country}{c.state ? ` · ${c.state}` : ''}</p>
              <h2 className="mt-2 font-sans text-3xl font-black tracking-tightest">{c.name}.</h2>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">Top artists · DJs · brands · creatives · events</p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] group-hover:opacity-100 opacity-50">View rankings →</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
