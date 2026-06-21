import PageHeader from '../components/PageHeader.jsx';
import InterviewCard from '../components/InterviewCard.jsx';
import SEO from '../components/SEO.jsx';
import { interviews } from '../data/content.js';

export default function Interviews() {
  return (
    <>
      <SEO
        title="Interviews | Direct2Culture"
        description="Editorial interviews with founders, artists, skaters, designers, and creators building the next wave of culture."
      />
      <PageHeader
        eyebrow="02 / Interviews"
        title="In their own words."
        kicker="Founders, artists, skaters, designers, creators. No press kit polish. No PR rep on the line."
        meta={`${interviews.length} conversations`}
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((iv, i) => (
              <InterviewCard key={iv.id} interview={iv} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
