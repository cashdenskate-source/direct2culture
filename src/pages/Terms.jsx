import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service | Direct2Culture" description="Direct2Culture terms of service." />
      <div className="container-edge py-12 lg:py-16 max-w-3xl">
        <PageHeader eyebrow="Direct2Culture / Legal" title="Terms of Service." kicker="Last updated: June 2026" />

        <article className="prose prose-neutral mt-12 space-y-6 text-ink/85 leading-relaxed">
          <Section title="1. Acceptance">
            By using direct2culture.com you agree to these terms. If you don't agree, don't use the site.
          </Section>

          <Section title="2. Accounts">
            You're responsible for keeping your password safe. We can suspend any account that violates these terms or applicable law.
          </Section>

          <Section title="3. User Content & Submissions">
            When you submit content (brands, drops, music, releases, photos), you grant Direct2Culture a non-exclusive,
            worldwide license to display and promote it across our site, newsletter, and social channels for editorial purposes.
            You confirm you own the rights to what you submit.
          </Section>

          <Section title="4. Editorial Independence">
            Direct2Culture decides what gets featured. Paid placements (see /pricing) are clearly disclosed where they appear.
            We reserve the right to decline any submission for any reason.
          </Section>

          <Section title="5. The Markets">
            Stats shown on the Music Market, Brand Market, and other exchange pages are based on data we receive from artists,
            brands, public APIs, and our own tracking. Numbers can lag, be incomplete, or be adjusted. Don't treat them as financial advice.
          </Section>

          <Section title="6. Payments">
            Paid plans (Featured Placement, Brand Packages, etc.) are billed via Stripe when enabled. Refunds within 7 days
            of purchase if the deliverable has not yet been published.
          </Section>

          <Section title="7. Prohibited Use">
            No spam. No impersonation. No infringing content. No automated scraping. No attempts to compromise the site.
          </Section>

          <Section title="8. Termination">
            We can remove content, suspend accounts, or stop offering services at any time, for any reason.
          </Section>

          <Section title="9. Liability">
            Site is provided "as is" without warranty. We're not liable for any loss arising from use of the site.
          </Section>

          <Section title="10. Changes">
            We may update these terms. Continued use after a change means you accept the new terms.
          </Section>

          <Section title="11. Contact">
            Questions: <a href="mailto:hello@direct2culture.com" className="underline">hello@direct2culture.com</a>
          </Section>
        </article>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          This is a template. Have a lawyer review before production.
        </p>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-sans text-xl font-black tracking-tight">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}
