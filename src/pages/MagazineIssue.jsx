import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { issueBySlug } from '../data/magazineData.js';

export default function MagazineIssue() {
  const { slug } = useParams();
  const issue = issueBySlug(slug);
  if (!issue) return <Navigate to="/magazine" replace />;

  return (
    <>
      <SEO
        title={`Issue ${String(issue.number).padStart(2, '0')}: ${issue.title} | Direct2Culture`}
        description={issue.description}
        type="article"
      />
      <div className="border-b border-ink/10">
        <div className="container-edge py-16 lg:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            Issue #{String(issue.number).padStart(2, '0')} · {issue.season}
          </p>
          <h1 className="mt-3 font-sans font-black tracking-tightest text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            {issue.title}.
          </h1>
          <p className="mt-6 max-w-2xl text-ink/75 text-xl md:text-2xl leading-snug">{issue.description}</p>
        </div>
      </div>

      {/* Cover Story */}
      <section className="border-b border-ink/10 bg-ink text-bone">
        <div className="container-edge py-16 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Cover Story</p>
          <h2 className="mt-3 font-sans text-3xl md:text-5xl font-black tracking-tightest">{issue.coverStory}.</h2>
          <Link to={issue.coverStoryHref} className="mt-6 inline-block bg-bone text-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90">
            Read Cover Story →
          </Link>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="container-edge py-16 lg:py-24 max-w-4xl">
        <h2 className="font-sans text-3xl font-black tracking-tight border-b border-ink pb-4">Table of Contents</h2>
        <ul className="divide-y divide-ink/10 mt-2">
          {issue.tableOfContents.map((t, i) => (
            <li key={i} className="py-5 grid grid-cols-12 gap-4 items-center">
              <p className="col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{t.section}</p>
              <p className="col-span-7 font-sans text-lg font-bold tracking-tight">{t.title}</p>
              <p className="col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{t.creator}</p>
              <p className="col-span-1 text-right">
                <Link to={t.href} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">→</Link>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-ink/10 bg-bone">
        <div className="container-edge py-16 lg:py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Get the print copy</p>
            <h3 className="mt-2 font-sans text-3xl font-black tracking-tight">${issue.printPrice} + free digital</h3>
          </div>
          <button
            onClick={() => alert(`Stripe checkout for print "Issue ${issue.number}" — not wired yet.`)}
            className="btn-primary"
          >
            Buy Print →
          </button>
        </div>
      </section>

      <div className="container-edge py-8">
        <Link to="/magazine" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← All issues</Link>
      </div>
    </>
  );
}
