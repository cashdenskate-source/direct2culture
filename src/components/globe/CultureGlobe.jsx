import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Earth-at-night texture (free, hosted on unpkg as part of three-globe)
const EARTH_NIGHT = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const BUMP_MAP = '//unpkg.com/three-globe/example/img/earth-topology.png';

export default function CultureGlobe({ points = [], arcs = [], size = 720 }) {
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
      />
    </div>
  );
}
