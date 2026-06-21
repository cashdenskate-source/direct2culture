import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/market', label: 'Music', end: true },
  { to: '/market/brands', label: 'Brands' },
  { to: '/market/upcoming', label: 'Upcoming Drops' },
];

export default function MarketTabs() {
  return (
    <nav className="border-b border-ink/10 mb-8">
      <div className="container-edge flex gap-6 overflow-x-auto">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 pb-3 pt-1 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                isActive ? 'border-ink text-ink' : 'border-transparent text-ash hover:text-ink'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
