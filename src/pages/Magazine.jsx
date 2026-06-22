import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { issues, currentIssue } from '../data/magazineData.js';

export default function Magazine() {
  return (
    <>
      <SEO
        title="Magazine | Direct2Culture"
        description="The Direct2Culture magazine. Quarterly. Print + digital. Culture before the algorithm."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Magazine"
          title="The Magazine."
          kicker="Quarterly print + digital. Long-form features on the brands, artists, drops, and culture moving forward."
        />

        {/* Current issue */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
          <div className="aspect-[3/4] border border-ink/15 bg-gradient-to-br from-ink/15 to-ink/[0.04] flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash">Issue {String(currentIssue.number).padStart(2, '0')}</p>
              <p className="mt-3 font-sans text-2xl md:text-3xl font-black tracking-tightest text-ink/40">{currentIssue.title}.</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Current Issue · {currentIssue.season}</p>
            <h2 className="mt-3 font-sans text-4xl md:text-6xl font-black tracking-tightest">{currentIssue.title}.</h2>
            <p className="mt-4 max-w-2xl text-ink/80 text-lg leading-relaxed">{currentIssue.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/magazine/${currentIssue.slug}`} className="btn-primary">Read Digital →</Link>
              <button
                onClick={() => alert(`Stripe checkout for "Issue ${currentIssue.number}" print copy — not wired yet.`)}
                className="border border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
              >
                Buy Print · ${currentIssue.printPrice} →
              </button>
            </div>
          </div>
        </div>

        {/* Archive */}
        <h3 className="mt-20 font-sans text-2xl font-black tracking-tight border-b border-ink pb-3">Issues</h3>
        <ul className="divide-y divide-ink/10">
          {issues.map((i) => (
            <li key={i.id} className="py-5 flex items-center gap-4">
              <p className="w-12 font-mono text-[11px] uppercase tracking-[0.25em] text-ash">#{String(i.number).padStart(2, '0')}</p>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-bold tracking-tight truncate">{i.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{i.season} · cover: {i.coverStory}</p>
              </div>
              <Link to={`/magazine/${i.slug}`} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
                Read →
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">Submit For Magazine</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">Pitch the next issue.</h3>
          <p className="mt-3 text-ink/80 max-w-2xl">Editorial reviews submissions for every issue. Long-form features, brand stories, drops, and city reports.</p>
          <Link to="/tell-your-story?ref=magazine" className="mt-5 inline-block btn-primary">Submit Pitch →</Link>
        </div>
      </div>
    </>
  );
}
