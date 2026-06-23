import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Earth-at-night texture (free, hosted on unpkg as part of three-globe)
const EARTH_NIGHT = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const BUMP_MAP = '//unpkg.com/three-globe/example/img/earth-topology.png';

export default function CultureGlobe({ points = [], arcs = [], badges = [], size = 720 }) {
  const globeRef = useRef(null);
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ w: size, h: size });

  // Auto-rotate
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
    }
    // Initial camera position
    globeRef.current.pointOfView({ lat: 25, lng: -40, altitude: 2.2 }, 0);
  }, []);

  // Responsive sizing
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const w = Math.min(size, wrap.offsetWidth);
      setDims({ w, h: w });
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [size]);

  return (
    <div ref={wrapRef} style={{ maxWidth: size, aspectRatio: '1', margin: '0 auto', width: '100%' }}>
      <Globe
        ref={globeRef}
        width={dims.w}
        height={dims.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={EARTH_NIGHT}
        bumpImageUrl={BUMP_MAP}
        showAtmosphere
        atmosphereColor="#ffffff"
        atmosphereAltitude={0.18}

        // Points / pings
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={(d) => d.altitude ?? 0.01}
        pointRadius={(d) => d.radius ?? 0.4}
        pointsMerge={false}
        pointsTransitionDuration={400}

        // Arcs between cities
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={(d) => d.color || ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.2)']}
        arcDashLength={0.5}
        arcDashGap={0.3}
        arcDashAnimateTime={2200}
        arcAltitude={(d) => d.altitude ?? 0.18}
        arcStroke={0.45}

        // HTML badges (brand logos / creator portraits / song tickers)
        htmlElementsData={badges}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.02}
        htmlElement={(d) => {
          const el = document.createElement('a');
          el.href = d.href || '#';
          el.target = '_self';
          el.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px; height: 36px;
            border-radius: 9999px;
            background: rgba(10,10,10,0.85);
            border: 1.5px solid rgba(255,255,255,0.5);
            box-shadow: 0 0 0 3px rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.4);
            color: #fff;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            text-decoration: none;
            pointer-events: auto;
            cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            overflow: hidden;
          `;
          if (d.logo) {
            const img = document.createElement('img');
            img.src = d.logo;
            img.alt = d.name || '';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            img.onerror = () => { el.removeChild(img); el.textContent = d.short || ''; };
            el.appendChild(img);
          } else {
            el.textContent = d.short || '';
          }
          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.25)';
            el.style.boxShadow = '0 0 0 5px rgba(255,255,255,0.18), 0 6px 22px rgba(0,0,0,0.5)';
          });
          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
            el.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.4)';
          });
          el.title = d.name || '';
          return el;
        }}
      />
    </div>
  );
}
