import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const options = [
  { to: '/market', label: 'Music' },
  { to: '/market/djs', label: 'DJs' },
  { to: '/market/creatives', label: 'Creatives' },
  { to: '/market/brands', label: 'Brands' },
  { to: '/market/art', label: 'Art' },
];

function activeOption(pathname) {
  if (pathname.startsWith('/market/djs') || pathname.startsWith('/market/dj/') || pathname.startsWith('/market/dj-usb')) return options[1];
  if (pathname.startsWith('/market/creatives') || pathname.startsWith('/market/creative/')) return options[2];
  if (pathname.startsWith('/market/brands') || pathname.startsWith('/market/brand/')) return options[3];
  if (pathname.startsWith('/market/art')) return options[4];
  return options[0];
}

export default function MarketTabs() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const current = activeOption(location.pathname);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <nav className="border-b border-ink/10 mb-8">
      <div className="container-edge flex items-center justify-between py-3 gap-3 flex-wrap">
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 border border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="opacity-60">Market /</span>
            <span className="font-bold">{current.label}</span>
            <span className="opacity-60">▾</span>
          </button>
          {open && (
            <ul className="absolute left-0 top-full mt-1 z-50 min-w-[240px] border border-ink bg-bone shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
              {options.map((o) => (
                <li key={o.to}>
                  <button
                    onClick={() => { setOpen(false); navigate(o.to); }}
                    className={`flex w-full items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                      current.to === o.to ? 'bg-ink text-bone' : 'text-ink hover:bg-ink hover:text-bone'
                    }`}
                  >
                    <span>{o.label}</span>
                    <span className="opacity-60">→</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          to="/market/upcoming"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink"
        >
          Upcoming Drops →
        </Link>
      </div>
    </nav>
  );
}
