import Prism from './prism/Prism.jsx';

// Site-wide animated 3D background. Sits fixed behind all content at z-index -1.
// Opacity is tuned so it sits subtle behind the bone background — bump up for more drama.
export default function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.35,
      }}
    >
      <Prism
        animationType="3drotate"
        timeScale={0.4}
        height={3.5}
        baseWidth={5.5}
        scale={3.8}
        hueShift={0}
        colorFrequency={1}
        noise={0.35}
        glow={0.9}
        bloom={1.1}
        suspendWhenOffscreen={false}
      />
    </div>
  );
}
