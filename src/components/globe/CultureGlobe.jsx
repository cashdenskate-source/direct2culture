import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

// Renders a 3D globe with markers. Pings prop = [{ lat, lng, color }].
// Auto-spins. Suspends when offscreen for perf.
export default function CultureGlobe({ markers = [], size = 600 }) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const phi = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    let width = 0;
    const onResize = () => { if (canvasRef.current) width = canvasRef.current.offsetWidth; };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.95, 0.95, 0.9],   // bone
      markerColor: [1, 1, 1],          // white
      glowColor: [0.55, 0.55, 0.55],
      markers,
      onRender: (state) => {
        if (!pointerInteracting.current) phi.current += 0.003;
        state.phi = phi.current + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => { if (canvasRef.current) canvasRef.current.style.opacity = '1'; }, 80);
    return () => { globe.destroy(); window.removeEventListener('resize', onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers)]);

  return (
    <div className="relative" style={{ maxWidth: size, aspectRatio: '1', margin: '0 auto', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', cursor: 'grab', opacity: 0, transition: 'opacity 1s ease' }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
      />
    </div>
  );
}
