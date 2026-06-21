import { Link } from 'react-router-dom';

export default function SectionTitle({ eyebrow, title, kicker, link, linkLabel = 'View All' }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="display-md mt-3">{title}</h2>
        {kicker && <p className="mt-3 max-w-2xl text-ink/70 text-base sm:text-lg">{kicker}</p>}
      </div>
      {link && (
        <Link to={link} className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:underline whitespace-nowrap">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
