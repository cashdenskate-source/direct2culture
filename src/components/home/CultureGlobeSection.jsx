import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CultureGlobe from '../globe/CultureGlobe.jsx';
import { subscribeCultureEvents, startSimulatedPings } from '../../lib/cultureEvents.js';
import { SEED_CITIES } from '../../lib/cityCoords.js';

const MAX_FEED = 12;
const SEED_POINTS = SEED_CITIES.map((c) => ({
  id: `seed_${c.label}`,
  lat: c.lat,
  lng: c.lng,
  color: 'rgba(255,255,255,0.85)',
  radius: 0.35,
  altitude: 0.01,
}));

function colorToCss(c) {
  const [r, g, b] = c;
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

function pickRandom(arr, exclude) {
  const opts = arr.filter((c) => !exclude || (c.lat !== exclude.lat || c.lng !== exclude.lng));
  return opts[Math.floor(Math.random() * opts.length)] || arr[0];
}

export default function CultureGlobeSection() {
  const [points, setPoints] = useState(SEED_POINTS);
  const [arcs, setArcs] = useState([]);
  const [feed, setFeed] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const timers = useRef([]);

  function addPing(event) {
    if (event.lat == null || event.lng == null) return;
    const css = colorToCss(event.color);
    const pingId = `ping_${event.id}_${Math.random().toString(36).slice(2, 6)}`;

    // Add bright pulsing point
    const point = {
      id: pingId,
      lat: event.lat,
      lng: event.lng,
      color: css,
      radius: 0.8,
      altitude: 0.03,
    };
    setPoints((p) => [...p, point]);

    // Add an arc from a random other D2C city to this destination
    const source = pickRandom(SEED_CITIES, { lat: event.lat, lng: event.lng });
    const arc = {
      id: pingId + '_arc',
      startLat: source.lat,
      startLng: source.lng,
      endLat: event.lat,
      endLng: event.lng,
      color: [css, 'rgba(255,255,255,0)'],
      altitude: 0.25 + Math.random() * 0.15,
    };
    setArcs((a) => [...a, arc]);

    // Cleanup after animations finish
    const tPoint = setTimeout(() => {
      setPoints((p) => p.filter((x) => x.id !== pingId));
    }, 2400);
    const tArc = setTimeout(() => {
      setArcs((a) => a.filter((x) => x.id !== pingId + '_arc'));
    }, 3000);
    timers.current.push(tPoint, tArc);

    setFeed((f) => [event, ...f].slice(0, MAX_FEED));
    setTotalToday((n) => n + 1);
  }

  useEffect(() => {
    const unsubReal = subscribeCultureEvents(addPing);
    const unsubSim = startSimulatedPings(addPing, 3500);
    return () => {
      unsubReal();
      unsubSim();
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <section className="border-y border-ink/10 bg-ink text-bone relative overflow-hidden">
      <div className="container-edge py-20 lg:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-bone/15 pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Direct From The Source · Globally</p>
            <h2 className="display-lg mt-4">Culture, live.</h2>
            <p className="mt-3 max-w-2xl text-bone/70 text-lg">
              Every sign-up, drop, spin, pre-save, and signal — pinged on the map as it happens.
            </p>
          </div>
          <div className="flex items-baseline gap-6">
            <Stat label="Signals today" value={totalToday} />
            <Stat label="Live cities" value={SEED_CITIES.length} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 mt-12">
          <div className="flex items-center justify-center min-h-[500px]">
            <CultureGlobe points={points} arcs={arcs} size={720} />
          </div>

          <aside className="space-y-2">
            <div className="flex items-center gap-2 pb-3 border-b border-bone/15">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Live feed</p>
            </div>
            {feed.length === 0 ? (
              <p className="py-4 text-bone/50 text-sm">Listening…</p>
            ) : (
              <ul className="space-y-2.5 max-h-[500px] overflow-y-auto">
                {feed.map((e) => (
                  <li key={e.id} className="flex items-start gap-2 text-sm">
                    <span
                      className="inline-block mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: colorToCss(e.color) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-bone truncate">{e.label}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 truncate">
                        {e.city} · {agoText(e.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
            Pings = real Firestore activity + simulated cultural pulse. Drag to rotate.
          </p>
          <Link to="/market" className="font-mono text-[11px] uppercase tracking-[0.25em] border border-bone/40 text-bone px-4 py-2 hover:bg-bone hover:text-ink transition-colors">
            Open Market →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">{label}</p>
      <p className="mt-1 font-sans text-3xl md:text-4xl font-black tracking-tightest tabular-nums">{value}</p>
    </div>
  );
}

function agoText(ts) {
  const diff = Date.now() - ts;
  if (diff < 5000) return 'just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}
