// CSS-driven aurora background. No deps, ~zero perf cost.
// Renders behind content via absolute positioning — set parent to relative + overflow-hidden.

export default function Aurora({ opacity = 0.55, blur = 80 }) {
  return (
    <div
      aria-hidden="true"
      className="aurora-root pointer-events-none absolute inset-0"
      style={{ opacity, filter: `blur(${blur}px) saturate(1.1)` }}
    >
      <span className="aurora aurora-1" />
      <span className="aurora aurora-2" />
      <span className="aurora aurora-3" />
      <span className="aurora aurora-4" />

      <style>{`
        .aurora-root { mix-blend-mode: screen; }
        .aurora {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          will-change: transform, opacity;
        }
        .aurora-1 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba(120, 180, 255, 0.55) 0%,
            rgba(120, 180, 255, 0.15) 35%,
            transparent 70%);
          animation: a-float-1 22s ease-in-out infinite alternate;
        }
        .aurora-2 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba(180, 140, 255, 0.45) 0%,
            rgba(180, 140, 255, 0.12) 35%,
            transparent 70%);
          animation: a-float-2 28s ease-in-out infinite alternate;
        }
        .aurora-3 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba(120, 255, 200, 0.4) 0%,
            rgba(120, 255, 200, 0.1) 35%,
            transparent 70%);
          animation: a-float-3 32s ease-in-out infinite alternate;
        }
        .aurora-4 {
          background: radial-gradient(closest-side at 50% 50%,
            rgba(255, 220, 140, 0.35) 0%,
            rgba(255, 220, 140, 0.08) 35%,
            transparent 70%);
          animation: a-float-4 36s ease-in-out infinite alternate;
        }
        @keyframes a-float-1 {
          0%   { transform: translate(-15%, -10%) scale(1);   }
          50%  { transform: translate( 20%,  5%) scale(1.2);  }
          100% { transform: translate( -5%, 15%) scale(0.95); }
        }
        @keyframes a-float-2 {
          0%   { transform: translate( 25%, 20%) scale(0.9); }
          50%  { transform: translate(-15%, -5%) scale(1.15); }
          100% { transform: translate( 10%, 25%) scale(1);   }
        }
        @keyframes a-float-3 {
          0%   { transform: translate( 10%, -25%) scale(1.1); }
          50%  { transform: translate(-20%,  10%) scale(0.85); }
          100% { transform: translate( 15%,  20%) scale(1.2);  }
        }
        @keyframes a-float-4 {
          0%   { transform: translate(-25%, 10%) scale(1);    }
          50%  { transform: translate( 15%, -15%) scale(1.25); }
          100% { transform: translate( -10%, 5%) scale(0.9);   }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora { animation: none; }
        }
      `}</style>
    </div>
  );
}
