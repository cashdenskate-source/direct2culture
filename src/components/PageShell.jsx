export default function PageShell({ eyebrow, title, kicker, actions, children }) {
  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="display-md mt-3">{title}</h1>
          {kicker && <p className="mt-3 max-w-2xl text-ink/70">{kicker}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
      <div className="pt-10">{children}</div>
    </div>
  );
}
