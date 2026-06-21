import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import SongCard from '../components/market/SongCard.jsx';
import BrandStockCard from '../components/market/BrandStockCard.jsx';
import DJCard from '../components/market/DJCard.jsx';
import CreativeCard from '../components/market/CreativeCard.jsx';
import { db, hasFirebaseConfig } from '../lib/firebase.js';
import { cityFromSlug, isCityMatch } from '../data/cityData.js';

export default function CityDetail() {
  const { slug } = useParams();
  const city = cityFromSlug(slug);
  const [data, setData] = useState({ songs: [], brands: [], djs: [], creatives: [], events: [] });

  useEffect(() => {
    if (!hasFirebaseConfig || !db || !city) return;
    (async () => {
      const [songs, brands, djs, creatives, events] = await Promise.all([
        getDocs(collection(db, 'songs')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => []),
        getDocs(collection(db, 'brands')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => []),
        getDocs(collection(db, 'djs')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => []),
        getDocs(collection(db, 'creatives')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => []),
        getDocs(collection(db, 'events')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => []),
      ]);
      setData({ songs, brands, djs, creatives, events });
    })();
  }, [city]);

  if (!city) return <Navigate to="/" replace />;

  const songs = useMemo(() => data.songs.filter((s) => isCityMatch(s.city, city)).slice(0, 5), [data.songs, city]);
  const brands = useMemo(() => data.brands.filter((b) => isCityMatch(b.hq, city) || isCityMatch(b.city, city)).slice(0, 5), [data.brands, city]);
  const djs = useMemo(() => data.djs.filter((d) => isCityMatch(d.city, city)).slice(0, 5), [data.djs, city]);
  const creatives = useMemo(() => data.creatives.filter((c) => isCityMatch(c.city, city)).slice(0, 5), [data.creatives, city]);
  const events = useMemo(() => data.events.filter((e) => isCityMatch(e.city, city) || isCityMatch(e.location, city)).slice(0, 5), [data.events, city]);

  return (
    <>
      <SEO
        title={`${city.name} Culture Rankings | Direct2Culture`}
        description={`Top artists, songs, DJs, brands, creatives, and upcoming events in ${city.name}.`}
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow={`City / ${city.name}`}
          title={`${city.name} culture.`}
          kicker={`Top artists, songs, DJs, brands, creatives, and events ${city.name}${city.state ? `, ${city.state}` : ''}.`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
          <Section title="Top Songs" subtitle="from this city" emptyMsg="No songs tagged with this city yet." link="/market">
            {songs.map((s, i) => <SongCard key={s.id} song={s} rank={i + 1} />)}
          </Section>
          <Section title="Top DJs" subtitle="from this city" emptyMsg="No DJs in this city yet." link="/market/djs">
            {djs.map((d, i) => <DJCard key={d.id} dj={d} rank={i + 1} />)}
          </Section>
          <Section title="Top Brands" subtitle="HQ'd here" emptyMsg="No brands HQ'd here." link="/market/brands">
            {brands.map((b, i) => <BrandStockCard key={b.id} brand={b} rank={i + 1} />)}
          </Section>
          <Section title="Top Creatives" subtitle="based here" emptyMsg="No creatives based here." link="/market/creatives">
            {creatives.map((c, i) => <CreativeCard key={c.id} creative={c} rank={i + 1} />)}
          </Section>
          <Section title="Upcoming Events" subtitle="in this city" emptyMsg="Nothing on the calendar." link="/events" className="lg:col-span-2">
            {events.length > 0 && (
              <ul className="divide-y divide-ink/10">
                {events.map((e) => (
                  <li key={e.id} className="py-4">
                    <p className="font-sans font-bold tracking-tight">{e.title || e.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{e.venue} · {e.date}</p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="mt-12">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← Back home</Link>
        </div>
      </div>
    </>
  );
}

function Section({ title, subtitle, children, emptyMsg, link, className = '' }) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);
  return (
    <section className={className}>
      <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
        <h2 className="font-sans text-2xl font-black tracking-tight">{title}</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{subtitle}</p>
      </div>
      {isEmpty ? (
        <div className="py-6 text-ink/60 text-sm">
          {emptyMsg} {link && <Link to={link} className="underline">Explore the market →</Link>}
        </div>
      ) : children}
    </section>
  );
}
