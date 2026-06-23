import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { signOut } from '../lib/auth.js';

const links = [
  { to: '/', label: 'Index' },
  // Top 5 — visible on desktop (slice(1, 6))
  { to: '/stories', label: 'Stories' },
  { to: '/creators', label: 'Creators' },
  { to: '/market', label: 'Market' },
  { to: '/tell-your-story', label: 'Tell Your Story' },
  { to: '/newsletter', label: 'The Culture Brief' },
  // Mobile-menu + footer only
  { to: '/identity-graph', label: 'Identity Graph' },
  { to: '/today', label: 'Today\'s Law' },
  { to: '/podcast', label: 'Podcast' },
  { to: '/magazine', label: 'Magazine' },
  { to: '/food', label: 'Food' },
  { to: '/afterdrama', label: 'AfterDrama' },
  { to: '/d2c-pro', label: 'D2C Pro' },
  { to: '/culture-signals', label: 'Culture Signals' },
  { to: '/interviews', label: 'Interviews' },
  { to: '/drops', label: 'Drops' },
  { to: '/events', label: 'Events' },
  { to: '/cities', label: 'Cities' },
  { to: '/pricing', label: 'Get Featured' },
  { to: '/submit', label: 'Submit' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function initialOf(profile, user) {
  const source = profile?.name || user?.email || '';
  return (source.trim()[0] || '?').toUpperCase();
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, role, isEditor, loading: authLoading } = useAuth();

  const dashboardHref = isEditor ? '/admin/dashboard' : '/dashboard';
  const dashboardLabel = isEditor ? 'Admin' : 'Dashboard';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function onLogout() {
    setMenuOpen(false);
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-ink/10 bg-bone/90 backdrop-blur' : 'border-transparent bg-bone'
      }`}
    >
      <div className="container-edge flex items-center justify-between py-4 md:py-5">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:opacity-70"
          >
            <span className="flex flex-col gap-[5px]">
              <span className={`block h-px w-5 bg-ink transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`block h-px w-5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-ink transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </span>
            <span className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
          </button>
          <Link to="/" className="flex items-center gap-3 group">
            <span className="block h-2 w-2 bg-ink group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-sans text-lg md:text-xl font-black tracking-tightest">
              DIRECT<span className="text-ash">2</span>CULTURE
            </span>
          </Link>
        </div>

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

        <div className="hidden lg:flex items-center gap-4">
          {authLoading ? (
            <Link to="/submit" className="btn-primary">Submit Brand</Link>
          ) : !user ? (
            <>
              <Link to="/login" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash hover:text-ink">
                Sign In →
              </Link>
              <Link to="/submit" className="btn-primary">Submit Brand</Link>
            </>
          ) : (
            <>
              <Link to={dashboardHref} className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:underline">
                {dashboardLabel} →
              </Link>
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  className="flex h-9 w-9 items-center justify-center bg-ink text-bone font-sans text-sm font-black tracking-tightest hover:opacity-90"
                >
                  {initialOf(profile, user)}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 border border-ink/15 bg-bone shadow-[0_10px_40px_-12px_rgba(10,10,10,0.25)] animate-fade-in z-50">
                    <div className="border-b border-ink/10 px-4 py-3">
                      <p className="font-sans text-sm font-bold tracking-tight truncate">{profile?.name || 'Account'}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">{user.email}</p>
                      {role && (
                        <p className="mt-2 inline-block px-2 py-0.5 border border-ink/30 font-mono text-[9px] uppercase tracking-[0.2em] text-ink">
                          {role}
                        </p>
                      )}
                    </div>
                    <div className="py-1">
                      <Link to={dashboardHref} className="block px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-bone">
                        {dashboardLabel}
                      </Link>
                      {!isEditor && (
                        <Link to="/dashboard/profile" className="block px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-bone">
                          Profile
                        </Link>
                      )}
                      <Link
                        to={isEditor ? '/admin/settings' : '/dashboard/settings'}
                        className="block px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-bone"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 border-t border-ink/10 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-bone"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-bone animate-fade-in">
          <nav className="container-edge flex flex-col py-6 gap-1 lg:grid lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0 lg:py-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3 border-b border-ink/10 font-sans text-2xl font-bold tracking-tighter lg:text-lg lg:py-3 ${
                    isActive ? 'text-ink' : 'text-ash hover:text-ink'
                  }`
                }
              >
                <span>{l.label}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ash">→</span>
              </NavLink>
            ))}

            <div className="mt-6 border-t border-ink/10 pt-4">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="btn-ghost w-full">Sign In</Link>
                  <Link to="/signup" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash text-center">
                    No account? Create one →
                  </Link>
                  <Link to="/submit" className="btn-primary w-full">Submit Your Brand</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-ink/10">
                    <span className="flex h-10 w-10 items-center justify-center bg-ink text-bone font-sans text-base font-black">
                      {initialOf(profile, user)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-base font-bold tracking-tight truncate">{profile?.name || 'Account'}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to={dashboardHref} className="btn-primary w-full">{dashboardLabel} →</Link>
                  <button onClick={onLogout} className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash text-center py-2">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
