import PageHeader from '../components/PageHeader.jsx';
import EventCard from '../components/EventCard.jsx';
import SEO from '../components/SEO.jsx';
import { events as seedEvents } from '../data/content.js';
import usePublishedContent from '../hooks/usePublishedContent.js';

export default function Events() {
  const { items: events } = usePublishedContent('events', seedEvents);
  return (
    <>
      <SEO
        title="Events | Direct2Culture"
        description="Culture events, skate sessions, pop-ups, listening parties, brand activations, and community meetups."
      />
      <PageHeader
        eyebrow="04 / Events"
        title="On the ground. In the city."
        kicker="Listening parties, showrooms, skate sessions, screenings, salons. The places where the next thing actually happens."
        meta={`${events.length} events confirmed`}
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
