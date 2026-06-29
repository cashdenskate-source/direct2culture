import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { signOut } from '../lib/auth.js';

// Desktop top-5 nav (always visible on lg+).
const topNav = [
  { to: '/stories', label: 'Stories' },
  { to: '/creators', label: 'Creators' },
  { to: '/market', label: 'Market' },
  { to: '/tell-your-story', label: 'Tell Your Story' },
  { to: '/newsletter', label: 'The Culture Brief' },
];

// Drawer (☰ Menu) is grouped by category — stacks on mobile, 5-column on desktop.
const sections = [
  {
    title: 'Read',
    items: [
      { to: '/stories', label: 'Stories' },
      { to: '/interviews', label: 'Interviews' },
      { to: '/culture-signals', label: 'Culture Signals' },
      { to: '/magazine', label: 'Magazine' },
      { to: '/today', label: "Today's Law" },
    ],
  },
  {
    title: 'Tune In',
    items: [
      { to: '/podcast', label: 'Podcast' },
      { to: '/films', label: 'Films' },
    ],
  },
  {
    title: 'Discover',
    items: [
      { to: '/creators', label: 'Creators' },
      { to: '/drops', label: 'Drops' },
      { to: '/fitness', label: 'Fitness' },
      { to: '/events', label: 'Events' },
      { to: '/cities', label: 'Cities' },
      { to: '/food', label: 'Food' },
      { to: '/afterdrama', label: 'AfterDrama' },
      { to: '/market', label: 'Market' },
      { to: '/identity-graph', label: 'Identity Graph' },
    ],
  },
  {
    title: 'For Creators',
    items: [
      { to: '/tell-your-story', label: 'Tell Your Story' },
      { to: '/submit', label: 'Submit' },
      { to: '/pricing', label: 'Get Featured' },
      { to: '/d2c-pro', label: 'D2C Pro' },
    ],
  },
  {
    title: 'Direct2Culture',
    items: [
      { to: '/', label: 'Index' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/newsletter', label: 'The Culture Brief' },
    ],
  },
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
          {topNav.map((l) => (
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
          <div className="container-edge py-6 lg:py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                    {section.title}
                  </p>
                  <nav className="mt-4 flex flex-col">
                    {section.items.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) =>
                          `flex items-center justify-between border-b border-ink/10 py-3 font-sans text-2xl font-bold tracking-tighter lg:border-none lg:py-1.5 lg:text-base ${
                            isActive ? 'text-ink' : 'text-ash hover:text-ink'
                          }`
                        }
                      >
                        <span>{l.label}</span>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-ash lg:hidden">→</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-ink/10 pt-6">
              {!user ? (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <Link to="/login" className="btn-ghost w-full lg:w-auto">Sign In</Link>
                  <Link to="/signup" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash text-center lg:flex-1">
                    No account? Create one →
                  </Link>
                  <Link to="/submit" className="btn-primary w-full lg:w-auto">Submit Your Brand</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3 pb-3 border-b border-ink/10 lg:border-none lg:pb-0">
                    <span className="flex h-10 w-10 items-center justify-center bg-ink text-bone font-sans text-base font-black">
                      {initialOf(profile, user)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-base font-bold tracking-tight truncate">{profile?.name || 'Account'}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
                    <Link to={dashboardHref} className="btn-primary w-full lg:w-auto">{dashboardLabel} →</Link>
                    <button onClick={onLogout} className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash text-center py-2 lg:py-0">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
