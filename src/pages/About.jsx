import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';

export default function About() {
  return (
    <>
      <SEO
        title="About | Direct2Culture"
        description="Direct2Culture exists to document culture before it becomes mainstream. Independent brands, underground creators, and the people building from the source."
      />
      <PageHeader
        eyebrow="06 / About"
        title="Direct from the source."
        kicker="A media company built around one belief — the most important culture of the next decade is being built in the quiet pockets right now."
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-serif text-2xl sm:text-3xl leading-snug text-ink">
                Direct2Culture exists to document what culture actually looks like before it becomes mainstream.
                We spotlight independent brands, underground creators, founders, artists, skaters, and movements
                building from the source.
              </p>

              <div className="mt-12 space-y-8 text-lg text-ink/80 leading-relaxed">
                <p>
                  The algorithm is reactive. Culture is predictive. By the time something is trending, the people who
                  built it have already moved on to the next thing. Our job is to be in the room while it is being
                  built — not when it gets reposted six months later.
                </p>
                <p>
                  We do not chase virality. We do not run paid coverage. We do not write reviews on press kits.
                  Every signal, interview, drop, and event we document comes from direct contact with the people
                  shaping it.
                </p>
                <p>
                  Direct2Culture is for the readers, founders, artists, and operators who would rather find the next
                  thing six months early than read about it six months late.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5 lg:border-l lg:border-ink/15 lg:pl-10">
              <div className="space-y-10">
                <Pillar
                  num="01"
                  title="Culture before the algorithm"
                  body="We move at the speed of the source, not the feed."
                />
                <Pillar
                  num="02"
                  title="Connected directly to culture"
                  body="Founders, artists, and operators on speed dial. No press intermediaries."
                />
                <Pillar
                  num="03"
                  title="Built from the source"
                  body="Every story starts with a real person and a real point of view."
                />
                <Pillar
                  num="04"
                  title="Documenting what is next"
                  body="We are an archive of the present, written for the future."
                />
              </div>
            </aside>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ['100K+', 'Followers across platforms'],
              ['500+', 'Brands documented'],
              ['200+', 'Interviews on record'],
              ['12', 'Cities on the ground'],
            ].map(([n, label]) => (
              <div key={label} className="border-t border-ink/20 pt-6">
                <p className="font-sans text-4xl sm:text-5xl font-black tracking-tightest leading-none">{n}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap gap-4">
            <Link to="/submit" className="btn-primary">Submit Your Brand</Link>
            <Link to="/contact" className="btn-ghost">Get In Touch</Link>
          </div>
        </div>
      </section>

      {/* The Direct2Culture Flywheel */}
      <section className="border-t border-ink/10 bg-bone">
        <div className="container-edge py-20 lg:py-28">
          <p className="eyebrow">The Direct2Culture Flywheel</p>
          <h2 className="display-lg mt-4">How it grows.</h2>
          <p className="mt-6 max-w-2xl text-ink/75 text-lg">
            Direct2Culture doesn't grow by chasing the algorithm. It grows because the people we cover bring
            their audience with them, and the audience finds the next wave through us.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
            {[
              ['01', 'Interview the creator', 'We sit down with the artist, founder, designer, or DJ before the algorithm catches them.'],
              ['02', 'Creator shares', 'They post the story to their followers. The story is on their terms.'],
              ['03', 'Audience arrives', 'Their followers land on Direct2Culture for the first time.'],
              ['04', 'Audience subscribes', 'They join The Culture Brief and follow the Market.'],
              ['05', 'Audience discovers other creators', 'They click through to other stories. More creators get reach.'],
              ['06', 'Creators request coverage', 'Submissions pour in. We cover what fits the culture.'],
              ['07', 'More stories published', 'Each story compounds. SEO compounds. Reach compounds.'],
              ['08', 'More audience grows', 'The flywheel turns. Culture before the algorithm.'],
            ].map(([num, title, body]) => (
              <div key={num} className="flex gap-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash mt-1">{num}</span>
                <div>
                  <p className="font-sans text-lg font-bold tracking-tight">{title}</p>
                  <p className="mt-1 text-ink/70 text-base">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Pillar({ num, title, body }) {
  return (
    <div className="flex gap-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash mt-1">{num}</span>
      <div>
        <p className="font-sans text-xl font-bold tracking-tight">{title}</p>
        <p className="mt-1 text-ink/70 text-base">{body}</p>
      </div>
    </div>
  );
}
