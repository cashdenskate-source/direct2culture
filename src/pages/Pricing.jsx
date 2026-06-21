import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { pricingTiers } from '../data/pricingData.js';

export default function Pricing() {
  function onStripeClick(tier) {
    alert(`Stripe checkout for "${tier.name}" — not wired yet.\n\nWhen ready, this will call Stripe.redirectToCheckout({ priceId: "${tier.stripePlaceholder}" }).`);
  }

  return (
    <>
      <SEO
        title="Get Featured | Direct2Culture"
        description="Featured placement, brand packages, sponsored drops, and monthly culture partnerships. Six tiers from free to $499/mo."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Pricing"
          title="Get Featured."
          kicker="Submit free, or move to the front of the line. We don't gate culture — we just give what's loud a louder room."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {pricingTiers.map((t) => (
            <div
              key={t.id}
              className={`border p-6 flex flex-col ${
                t.featured ? 'border-ink bg-ink text-bone' : 'border-ink/15 bg-bone'
              }`}
            >
              <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${t.featured ? 'text-bone/60' : 'text-ash'}`}>
                {t.cadence === 'month' ? 'Subscription' : 'One-time'}
              </p>
              <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">{t.name}</h3>
              <p className={`mt-4 text-3xl font-black tracking-tightest tabular-nums ${t.featured ? '' : 'text-ink'}`}>
                {t.price === 0 ? 'Free' : `$${t.price}`}
                {t.cadence === 'month' && <span className={`text-base font-normal ${t.featured ? 'text-bone/60' : 'text-ash'}`}> /mo</span>}
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${t.featured ? 'text-bone/85' : 'text-ink/80'}`}>{t.blurb}</p>
              <ul className={`mt-4 space-y-1.5 text-sm ${t.featured ? 'text-bone/85' : 'text-ink/85'}`}>
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="opacity-50">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-current/15">
                {t.href ? (
                  <Link to={t.href} className={`block w-full text-center py-3 font-mono text-[11px] uppercase tracking-[0.25em] border transition-colors ${
                    t.featured ? 'border-bone text-bone hover:bg-bone hover:text-ink' : 'border-ink text-ink hover:bg-ink hover:text-bone'
                  }`}>
                    {t.cta}
                  </Link>
                ) : (
                  <button onClick={() => onStripeClick(t)} className={`block w-full text-center py-3 font-mono text-[11px] uppercase tracking-[0.25em] border transition-colors ${
                    t.featured ? 'border-bone text-bone hover:bg-bone hover:text-ink' : 'border-ink text-ink hover:bg-ink hover:text-bone'
                  }`}>
                    {t.cta}
                  </button>
                )}
                {t.stripePlaceholder && (
                  <p className={`mt-2 text-center font-mono text-[9px] uppercase tracking-[0.25em] ${t.featured ? 'text-bone/40' : 'text-ash/60'}`}>
                    Stripe-ready · {t.stripePlaceholder}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">Questions</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">Need something custom?</h3>
          <p className="mt-3 text-ink/80 max-w-2xl">
            Label rollouts, festival activations, multi-month campaigns — we build packages for that too.
            Send a note and we'll come back with a number.
          </p>
          <Link to="/contact" className="mt-5 inline-block btn-primary">Contact Editorial →</Link>
        </div>
      </div>
    </>
  );
}
