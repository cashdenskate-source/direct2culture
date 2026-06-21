import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { signOut } from '../../lib/auth.js';

const navSections = [
  {
    title: 'Editorial',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', end: true },
      { to: '/admin/users', label: 'Sign-Ups' },
      { to: '/admin/calendar', label: 'Calendar' },
      { to: '/admin/market', label: 'Music Market' },
      { to: '/admin/djs', label: 'DJ Market' },
      { to: '/admin/creatives', label: 'Creative Market' },
      { to: '/admin/brands-market', label: 'Brand Market' },
      { to: '/admin/releases', label: 'Upcoming Drops' },
      { to: '/admin/submissions', label: 'Submissions' },
      { to: '/admin/messages', label: 'Messages' },
      { to: '/admin/newsletter', label: 'Newsletter' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/content', label: 'Overview', end: true },
      { to: '/admin/culture-signals', label: 'Culture Signals' },
      { to: '/admin/interviews', label: 'Interviews' },
      { to: '/admin/drops', label: 'Drops' },
      { to: '/admin/events', label: 'Events' },
    ],
  },
  {
    title: 'System',
    items: [{ to: '/admin/settings', label: 'Settings' }],
  },
];

export default function AdminLayout() {
  const { user, profile, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  async function onLogout() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-bone">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ink text-bone">
        <div className="container-edge flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2" aria-label="Menu">
              <span className="block h-px w-5 bg-bone mb-1" />
              <span className="block h-px w-5 bg-bone mb-1" />
              <span className="block h-px w-5 bg-bone" />
            </button>
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="block h-2 w-2 bg-bone" />
              <span className="font-sans text-base font-black tracking-tightest">D2C / ADMIN</span>
            </Link>
            <span className="hidden md:inline-block ml-3 px-2 py-1 border border-bone/30 font-mono text-[9px] uppercase tracking-[0.25em] text-bone/80">
              {role || 'staff'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden md:inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 hover:text-bone">
              View Site →
            </Link>
            <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
              {profile?.name || user?.email}
            </span>
            <button onClick={onLogout} className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/70 hover:text-bone">
              Sign out →
            </button>
          </div>
        </div>
      </header>

      <div className="container-edge flex gap-10 py-8 lg:py-12">
        <aside className={`lg:w-64 lg:shrink-0 ${mobileOpen ? 'fixed inset-0 z-50 bg-bone p-6 pt-20 overflow-y-auto' : 'hidden lg:block'}`}>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-[0.25em]">
              Close ✕
            </button>
          )}
          {navSections.map((section) => (
            <div key={section.title} className="mb-8">
              <p className="eyebrow">{section.title}</p>
              <nav className="mt-3 space-y-1">
                {section.items.map((item) => (
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
            </div>
          ))}
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
