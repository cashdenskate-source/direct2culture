import { Link } from 'react-router-dom';
import DomeGallery from '../dome/DomeGallery.jsx';
import { creators } from '../../data/creatorData.js';

// Use creators' image placeholders if set, otherwise fall back to the default Unsplash set in DomeGallery.
// Replace these by editing imagePlaceholder fields in src/data/creatorData.js or hosting on Firebase Storage.
const FALLBACK = [
  // Replace with your own image URLs. Any number of images works — the dome tiles them automatically.
  // Example: '/creators/cee.jpg'
];

export default function CreatorDome() {
  const images = creators
    .map((c) => c.imagePlaceholder)
    .filter(Boolean);

  const pool = images.length > 0 ? images : FALLBACK;

  return (
    <section className="border-b border-ink/10 bg-ink text-bone relative overflow-hidden">
      <div className="container-edge pt-20 lg:pt-24 pb-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Direct2Culture / The Dome</p>
            <h2 className="display-lg mt-3">The faces of culture.</h2>
            <p className="mt-3 max-w-2xl text-bone/70 text-lg">
              Drag to explore. Click any tile. Every face is a creator story.
            </p>
          </div>
          <Link to="/creators" className="border border-bone/30 text-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-bone hover:text-ink transition-colors">
            View All Creators →
          </Link>
        </div>
      </div>
      <div className="w-full" style={{ height: '70vh', minHeight: 480 }}>
        <DomeGallery
          images={pool.length > 0 ? pool : undefined}
          overlayBlurColor="#0a0a0a"
          grayscale={true}
          minRadius={500}
          fit={0.55}
        />
      </div>
    </section>
  );
}
