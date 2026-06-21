export default function PageHeader({ eyebrow, title, kicker, meta }) {
  return (
    <section className="relative border-b border-ink/10 bg-bone">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="container-edge relative pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{eyebrow}</p>
          {meta && <p className="eyebrow hidden md:block">{meta}</p>}
        </div>
        <h1 className="display-lg mt-8">{title}</h1>
        {kicker && (
          <p className="mt-6 max-w-3xl text-xl text-ink/75 leading-snug">
            {kicker}
          </p>
        )}
      </div>
    </section>
  );
}
