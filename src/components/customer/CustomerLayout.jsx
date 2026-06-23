import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { signOut } from '../../lib/auth.js';

const navItems = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/audience', label: 'Audience' },
  { to: '/dashboard/requests', label: 'Contact Requests' },
  { to: '/dashboard/submissions', label: 'My Submissions' },
  { to: '/dashboard/new-submission', label: 'New Submission' },
  { to: '/dashboard/drops', label: 'My Drops' },
  { to: '/dashboard/events', label: 'My Events' },
  { to: '/dashboard/interview-request', label: 'Interview Request' },
  { to: '/dashboard/submit-release', label: 'Drop a Release' },
  { to: '/dashboard/submit-dj', label: 'Apply as DJ' },
  { to: '/dashboard/submit-creative', label: 'Apply as Creative' },
  { to: '/dashboard/watchlist', label: 'Watchlist' },
  { to: '/dashboard/profile', label: 'Profile' },
  { to: '/dashboard/settings', label: 'Settings' },
];

export default function CustomerLayout() {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  async function onLogout() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-bone">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/95 backdrop-blur">
        <div className="container-edge flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2" aria-label="Menu">
              <span className="block h-px w-5 bg-ink mb-1" />
              <span className="block h-px w-5 bg-ink mb-1" />
              <span className="block h-px w-5 bg-ink" />
            </button>
            <Link to="/" className="flex items-center gap-3">
              <span className="block h-2 w-2 bg-ink" />
              <span className="font-sans text-base font-black tracking-tightest">D2C / DASHBOARD</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              {profile?.name || user?.email}
            </span>
            <button onClick={onLogout} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
              Sign out →
            </button>
          </div>
        </div>
      </header>

      <div className="container-edge flex gap-10 py-8 lg:py-12">
        <aside className={`lg:w-60 lg:shrink-0 ${mobileOpen ? 'fixed inset-0 z-50 bg-bone p-6 pt-20 overflow-y-auto' : 'hidden lg:block'}`}>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-[0.25em]">
              Close ✕
            </button>
          )}
          <p className="eyebrow">Customer</p>
          <nav className="mt-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between border-l-2 py-2 pl-3 pr-2 font-sans text-sm transition-colors ${
                    isActive ? 'border-ink text-ink font-semibold' : 'border-transparent text-ash hover:text-ink hover:border-ink/30'
                  }`
                }
              >
                <span>{item.label}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ash">→</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 border-t border-ink/10 pt-6">
            <Link to="/dashboard/new-submission" className="btn-primary w-full text-[10px]">
              New Submission +
            </Link>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
