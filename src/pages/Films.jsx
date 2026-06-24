import PageHeader from '../components/PageHeader.jsx';
import FilmCard from '../components/FilmCard.jsx';
import SEO from '../components/SEO.jsx';
import { films } from '../data/filmsData.js';

export default function Films() {
  return (
    <>
      <SEO
        title="Films | Direct2Culture"
        description="Short films, mini-docs, and music videos from directors building in culture — long-form video in a short-form era."
      />
      <PageHeader
        eyebrow="05 / Films"
        title="The D2C Films."
        kicker="Short films, mini-docs, and music videos from directors building in culture — long-form video in a short-form era."
        meta={`${films.length} films`}
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {films.map((f) => (
              <FilmCard key={f.id} film={f} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
