import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy | Direct2Culture" description="Direct2Culture privacy policy." />
      <div className="container-edge py-12 lg:py-16 max-w-3xl">
        <PageHeader eyebrow="Direct2Culture / Legal" title="Privacy Policy." kicker="Last updated: June 2026" />

        <article className="prose prose-neutral mt-12 space-y-6 text-ink/85 leading-relaxed">
          <Section title="1. What we collect">
            When you sign up: email, name, phone (optional), profile photo (optional), and what type of user you are (artist, brand, fan, etc.).
            When you submit content: anything you put in the submission form.
            When you browse: standard web analytics (pages, referrer, device type).
          </Section>

          <Section title="2. How we use it">
            To run your account, show you what you submitted, send you newsletters you opted into, surface relevant content, and
            improve the site. Editorial may review your submissions to decide what gets featured.
          </Section>

          <Section title="3. Where it's stored">
            Firebase (Google Cloud), located in the US. Newsletter list managed via Firebase Firestore.
            Payment data (when Stripe is enabled) is processed by Stripe — we don't store card numbers.
          </Section>

          <Section title="4. Who we share with">
            We don't sell your data. We share only with:
            <br />— Service providers we depend on (Firebase / Google Cloud / Stripe / our email provider)
            <br />— Law enforcement if legally required
            <br />— Advertisers, only as anonymized/aggregated stats — never your individual data
          </Section>

          <Section title="5. Cookies">
            We use minimal cookies for authentication and site preferences. No third-party ad tracking by default.
          </Section>

          <Section title="6. Your rights">
            You can update or delete your account anytime from <a href="/dashboard/profile" className="underline">your dashboard</a>.
            You can unsubscribe from newsletters via any newsletter link.
            For full data export or deletion, email <a href="mailto:privacy@direct2culture.com" className="underline">privacy@direct2culture.com</a>.
          </Section>

          <Section title="7. Children">
            The site is not directed at users under 13. We don't knowingly collect data from minors.
          </Section>

          <Section title="8. Changes">
            We'll update this policy when needed. Material changes will be announced via the site or email.
          </Section>

          <Section title="9. Contact">
            Privacy questions: <a href="mailto:privacy@direct2culture.com" className="underline">privacy@direct2culture.com</a>
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
