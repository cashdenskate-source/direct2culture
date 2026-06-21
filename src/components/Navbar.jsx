import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Index' },
  { to: '/culture-signals', label: 'Culture Signals' },
  { to: '/interviews', label: 'Interviews' },
  { to: '/drops', label: 'Drops' },
  { to: '/events', label: 'Events' },
  { to: '/submit', label: 'Submit' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-ink/10 bg-bone/90 backdrop-blur' : 'border-transparent bg-bone'
      }`}
    >
      <div className="container-edge flex items-center justify-between py-4 md:py-5">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="block h-2 w-2 bg-ink group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-sans text-lg md:text-xl font-black tracking-tightest">
            DIRECT<span className="text-ash">2</span>CULTURE
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.slice(1, 6).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-ink' : 'text-ash hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/about" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash hover:text-ink">
            About
          </Link>
          <Link to="/submit" className="btn-primary">
            Submit Brand
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
        >
          <span className={`block h-px w-6 bg-ink transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`block h-px w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-6 bg-ink transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink/10 bg-bone animate-fade-in">
          <nav className="container-edge flex flex-col py-6 gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3 border-b border-ink/10 font-sans text-2xl font-bold tracking-tighter ${
                    isActive ? 'text-ink' : 'text-ash'
                  }`
                }
              >
                <span>{l.label}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ash">→</span>
              </NavLink>
            ))}
            <Link to="/submit" className="btn-primary mt-6 w-full">
              Submit Your Brand
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
