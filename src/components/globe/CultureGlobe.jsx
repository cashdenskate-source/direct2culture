import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function CultureGlobe({ markers = [], size = 720 }) {
  const canvasRef = useRef(null);
  const markersRef = useRef(markers);
  const phi = useRef(0);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const widthRef = useRef(0);

  // Keep markers ref fresh without re-creating the globe
  useEffect(() => { markersRef.current = markers; }, [markers]);

  // Create the globe ONCE on mount. Markers update via ref inside onRender.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    widthRef.current = canvas.offsetWidth || 600;

    const ro = new ResizeObserver(() => {
      if (canvas) widthRef.current = canvas.offsetWidth;
    });
    ro.observe(canvas);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      markers: markersRef.current,
      onRender: (state) => {
        if (!pointerInteracting.current) phi.current += 0.004;
        state.phi = phi.current + pointerInteractionMovement.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
        state.markers = markersRef.current; // live update without recreate
      },
    });

    setTimeout(() => { canvas.style.opacity = '1'; }, 120);
    return () => { globe.destroy(); ro.disconnect(); };
  }, []);

  return (
    <div className="relative" style={{ maxWidth: size, aspectRatio: '1', margin: '0 auto', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1.2s ease',
          contain: 'layout paint size',
        }}
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
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
      />
    </div>
  );
}
