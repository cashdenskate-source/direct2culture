import { Link } from 'react-router-dom';

export default function EmptyState({ title, body, action, actionLabel }) {
  return (
    <div className="border border-dashed border-ink/20 p-10 sm:p-14 text-center">
      <p className="eyebrow">Nothing here yet</p>
      <h3 className="mt-4 font-sans text-2xl font-bold tracking-tight">{title}</h3>
      {body && <p className="mt-3 text-ink/70 max-w-md mx-auto">{body}</p>}
      {action && actionLabel && (
        <Link to={action} className="btn-primary mt-8 inline-flex">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
