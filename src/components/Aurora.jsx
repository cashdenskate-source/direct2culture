// CSS-driven aurora background. Tuned for light (bone) backgrounds.
// No deps, ~zero perf cost. Renders behind content via absolute positioning.

export default function Aurora({ opacity = 0.85, blur = 70 }) {
  return (
    <div
      aria-hidden="true"
      className="aurora-root pointer-events-none absolute inset-0"
      style={{ opacity, filter: `blur(${blur}px) saturate(1.4)` }}
    >
      <span className="aurora aurora-1" />
      <span className="aurora aurora-2" />
      <span className="aurora aurora-3" />
      <span className="aurora aurora-4" />

      <style>{`
        /* No mix-blend on light bg — straight transparency lets the colors actually tint */
        .aurora-root { overflow: hidden; }
        .aurora {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          will-change: transform, opacity;
        }
        .aurora-1 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba( 60,120,240, 0.75) 0%,
            rgba( 60,120,240, 0.30) 35%,
            transparent 70%);
          animation: a-float-1 22s ease-in-out infinite alternate;
        }
        .aurora-2 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba(160, 90,255, 0.70) 0%,
            rgba(160, 90,255, 0.25) 35%,
            transparent 70%);
          animation: a-float-2 28s ease-in-out infinite alternate;
        }
        .aurora-3 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba( 80,220,180, 0.65) 0%,
            rgba( 80,220,180, 0.22) 35%,
            transparent 70%);
          animation: a-float-3 32s ease-in-out infinite alternate;
        }
        .aurora-4 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba(255,160, 80, 0.55) 0%,
            rgba(255,160, 80, 0.20) 35%,
            transparent 70%);
          animation: a-float-4 36s ease-in-out infinite alternate;
        }
        @keyframes a-float-1 {
          0%   { transform: translate(-25%, -20%) scale(1);   }
          50%  { transform: translate( 30%,  10%) scale(1.25); }
          100% { transform: translate( -10%, 25%) scale(0.95); }
        }
        @keyframes a-float-2 {
          0%   { transform: translate( 30%, 25%) scale(0.9); }
          50%  { transform: translate(-25%, -15%) scale(1.2); }
          100% { transform: translate( 15%, 30%) scale(1);   }
        }
        @keyframes a-float-3 {
          0%   { transform: translate( 15%, -30%) scale(1.1); }
          50%  { transform: translate(-30%,  15%) scale(0.85); }
          100% { transform: translate( 20%,  25%) scale(1.25);  }
        }
        @keyframes a-float-4 {
          0%   { transform: translate(-30%, 15%) scale(1);    }
          50%  { transform: translate( 20%, -20%) scale(1.3); }
          100% { transform: translate( -15%, 10%) scale(0.9);  }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora { animation: none; }
        }
      `}</style>
    </div>
  );
}
