import { Link } from 'react-router-dom';

export default function AuthShell({ eyebrow, title, kicker, footer, children }) {
  return (
    <div className="min-h-screen bg-bone">
      <div className="container-edge flex items-center justify-between py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="block h-2 w-2 bg-ink" />
          <span className="font-sans text-lg font-black tracking-tightest">
            DIRECT<span className="text-ash">2</span>CULTURE
          </span>
        </Link>
        <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
          ← Back to site
        </Link>
      </div>
      <div className="container-edge grid grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:py-20">
        <aside className="lg:col-span-5">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-lg mt-4">{title}</h1>
          {kicker && <p className="mt-6 max-w-md text-ink/75 text-lg">{kicker}</p>}
        </aside>
        <div className="lg:col-span-7 lg:border-l lg:border-ink/15 lg:pl-12">
          <div className="max-w-md">
            {children}
            {footer && <div className="mt-8 border-t border-ink/10 pt-6">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
