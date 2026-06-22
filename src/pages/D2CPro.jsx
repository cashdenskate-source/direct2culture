import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { trackCTA } from '../lib/tracking.js';

const TIERS = [
  {
    id: 'guest', name: 'Guest', price: 0, cadence: 'forever', stripe: null,
    blurb: 'Read everything. Build a profile. Submit your work.',
    perks: ['Public Market access', 'Read all stories', 'Submit your brand / song / drop', 'Newsletter'],
    cta: 'Join Free',
    href: '/signup',
  },
  {
    id: 'builder', name: 'Builder', price: 9, cadence: 'month', stripe: 'price_builder_monthly',
    blurb: 'For the artists, founders, and creators building from the source.',
    perks: ['Verified profile badge', 'Submission priority queue', 'Watchlist alerts', 'Member-only newsletter', 'Early access to drops'],
    cta: 'Start Building',
  },
  {
    id: 'signal', name: 'Signal', price: 29, cadence: 'month', stripe: 'price_signal_monthly', featured: true,
    blurb: 'For the people moving culture — DJs, brands, taste-makers.',
    perks: ['Everything in Builder', 'Featured creator placement', 'Sponsored drop credits ($25/mo)', 'Discord access', 'Direct line to editorial'],
    cta: 'Move Culture',
  },
  {
    id: 'partner', name: 'Culture Partner', price: 99, cadence: 'month', stripe: 'price_partner_monthly',
    blurb: 'For the labels, agencies, and brands operating at scale.',
    perks: ['Everything in Signal', 'Quarterly magazine print spread credit', 'Custom analytics dashboard', 'White-glove campaign support', 'First-look at all new D2C features'],
    cta: 'Become a Partner',
  },
];

export default function D2CPro() {
  function onCheckout(t) {
    if (!t.stripe) return;
    trackCTA('d2c_pro_checkout', { tier: t.id });
    alert(`Stripe checkout for "${t.name}" ($${t.price}/${t.cadence}) — not wired yet.\n\nWhen ready: Stripe.redirectToCheckout({ priceId: "${t.stripe}" })`);
  }

  return (
    <>
      <SEO
        title="D2C Pro | Direct2Culture"
        description="Join the 3% building culture. Direct2Culture Pro — Builder, Signal, Culture Partner."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Pro"
          title="Join The 3% Building Culture."
          kicker="97% watch culture happen. The 3% build it, document it, and move it forward."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((t) => (
            <div key={t.id} className={`border p-6 flex flex-col ${t.featured ? 'border-ink bg-ink text-bone' : 'border-ink/15 bg-bone'}`}>
              <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${t.featured ? 'text-bone/60' : 'text-ash'}`}>
                {t.cadence === 'forever' ? 'Free forever' : `Per ${t.cadence}`}
              </p>
              <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">{t.name}</h3>
              <p className="mt-4 font-sans text-3xl font-black tracking-tightest tabular-nums">
                {t.price === 0 ? 'Free' : `$${t.price}`}
                {t.cadence === 'month' && <span className={`text-sm font-normal ${t.featured ? 'text-bone/60' : 'text-ash'}`}> /mo</span>}
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${t.featured ? 'text-bone/85' : 'text-ink/80'}`}>{t.blurb}</p>
              <ul className={`mt-4 space-y-1.5 text-sm ${t.featured ? 'text-bone/85' : 'text-ink/85'} flex-1`}>
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
                    {t.cta} →
                  </Link>
                ) : (
                  <button onClick={() => onCheckout(t)} className={`block w-full text-center py-3 font-mono text-[11px] uppercase tracking-[0.25em] border transition-colors ${
                    t.featured ? 'border-bone text-bone hover:bg-bone hover:text-ink' : 'border-ink text-ink hover:bg-ink hover:text-bone'
                  }`}>
                    {t.cta} →
                  </button>
                )}
                {t.stripe && (
                  <p className={`mt-2 text-center font-mono text-[9px] uppercase tracking-[0.25em] ${t.featured ? 'text-bone/40' : 'text-ash/60'}`}>
                    Stripe-ready · {t.stripe}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">The 3% Rule</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">Why "the 3%"?</h3>
          <p className="mt-3 text-ink/80 max-w-2xl leading-relaxed">
            Culture isn't moved by the crowd — it's moved by the 3% who build, document, and ship.
            Direct2Culture Pro is the membership for that 3%: the artists, founders, DJs, designers, and creators
            putting in the work before the algorithm catches it.
          </p>
        </div>
      </div>
    </>
  );
}
