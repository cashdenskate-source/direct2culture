import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function CultureGlobe({ markers = [], size = 600 }) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const phi = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    widthRef.current = canvas.offsetWidth;
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
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [0.95, 0.95, 0.95],
      glowColor: [1, 1, 1],
      markers,
      onRender: (state) => {
        if (!pointerInteracting.current) phi.current += 0.004;
        state.phi = phi.current + pointerInteractionMovement.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    setTimeout(() => { canvas.style.opacity = '1'; }, 100);
    return () => { globe.destroy(); ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers)]);

  return (
    <div className="relative" style={{ maxWidth: size, aspectRatio: '1', margin: '0 auto', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1s ease',
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
