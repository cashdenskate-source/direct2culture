import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import CultureSignalCard from '../components/CultureSignalCard.jsx';
import InterviewCard from '../components/InterviewCard.jsx';
import DropCard from '../components/DropCard.jsx';
import EventCard from '../components/EventCard.jsx';
import BrandCard from '../components/BrandCard.jsx';
import NewsletterForm from '../components/NewsletterForm.jsx';
import SEO from '../components/SEO.jsx';
import {
  cultureSignals,
  interviews,
  drops,
  events,
  brandsToWatch,
  creatorsToWatch,
} from '../data/content.js';

export default function Home() {
  return (
    <>
      <SEO />
      <Hero />

      <Section
        eyebrow="01 / Culture Signals"
        title="The signals underneath the noise."
        kicker="Trends, brands, sounds, and movements we are tracking right now — sourced from the people who are actually building them."
        link="/culture-signals"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cultureSignals.slice(0, 3).map((s, i) => (
            <CultureSignalCard key={s.id} signal={s} index={i} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="02 / Interviews"
        title="The people building it."
        kicker="Founders, artists, skaters, designers, creators — in their own words, without the press kit polish."
        link="/interviews"
        dark
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.slice(0, 3).map((iv, i) => (
            <InterviewCard key={iv.id} interview={iv} index={i} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="03 / Brands To Watch"
        title="Independent. Underground. Inevitable."
        kicker="Six brands operating in the quiet pockets of culture. You will know all of them inside two years."
        link="/culture-signals"
        linkLabel="See Full Index"
      >
        <div className="-mx-5 sm:-mx-8 lg:-mx-12">
          {brandsToWatch.map((b, i) => (
            <BrandCard key={b.id} brand={b} index={i} label="View Profile" />
          ))}
          <div className="border-t border-ink/20" />
        </div>
      </Section>

      <Section
        eyebrow="04 / Creators To Watch"
        title="The new front cover."
        kicker="Recording artists, documentarians, skaters, designers — six creators with point of view, not just output."
      >
        <div className="-mx-5 sm:-mx-8 lg:-mx-12">
          {creatorsToWatch.map((c, i) => (
            <BrandCard key={c.id} brand={c} index={i} label="View Profile" />
          ))}
          <div className="border-t border-ink/20" />
        </div>
      </Section>

      <Section
        eyebrow="05 / Upcoming Drops"
        title="Curated drop calendar."
        kicker="Fashion, music, merch, digital, and event drops handpicked by our editors. Everything direct from the source."
        link="/drops"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drops.slice(0, 3).map((d) => (
            <DropCard key={d.id} drop={d} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="06 / Upcoming Events"
        title="In the city. On the ground."
        kicker="Listening parties, showrooms, skate sessions, screenings, salons. The places where the next thing actually happens."
        link="/events"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {events.slice(0, 2).map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </Section>

      <section className="bg-ink text-bone">
        <div className="container-edge py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-bone/50">07 / The Dispatch</p>
              <h2 className="display-lg mt-4">
                Weekly culture brief.<br />Direct to your inbox.
              </h2>
              <p className="mt-6 max-w-xl text-bone/70 text-lg">
                One email a week. The brands we are watching, the interviews we are running, the drops we are obsessed with.
                Zero filler. Always the signal.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-end">
              <NewsletterForm variant="dark" />
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
                Unsubscribe anytime. We mean it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow">08 / Submit</p>
              <h2 className="display-lg mt-4">
                Building<br />something next?
              </h2>
              <p className="mt-6 max-w-2xl text-ink/75 text-xl leading-snug">
                If you are a founder, artist, skater, designer, creator, or organizer building from the source —
                we want to know. Submit your work.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link to="/submit" className="btn-primary text-base px-8 py-4">
                Submit Your Brand →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ eyebrow, title, kicker, link, linkLabel, children, dark }) {
  return (
    <section className={`border-b border-ink/10 ${dark ? 'bg-ink/[0.03]' : 'bg-bone'}`}>
      <div className="container-edge py-20 lg:py-24">
        <SectionTitle eyebrow={eyebrow} title={title} kicker={kicker} link={link} linkLabel={linkLabel} />
        <div className="mt-12 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}
