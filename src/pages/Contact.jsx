import PageHeader from '../components/PageHeader.jsx';
import ContactForm from '../components/ContactForm.jsx';
import SEO from '../components/SEO.jsx';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact | Direct2Culture"
        description="Get in touch with the Direct2Culture editorial team — press, partnerships, story tips, and general inquiries."
      />
      <PageHeader
        eyebrow="07 / Contact"
        title="Direct line."
        kicker="Press, partnerships, story tips, or just a hello. We read every message."
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <p className="eyebrow">Channels</p>
              <div className="mt-6 space-y-8">
                <Channel label="General" value="hello@direct2culture.com" href="mailto:hello@direct2culture.com" />
                <Channel label="Editorial Pitch" value="editorial@direct2culture.com" href="mailto:editorial@direct2culture.com" />
                <Channel label="Press" value="press@direct2culture.com" href="mailto:press@direct2culture.com" />
                <Channel label="Partnerships" value="partners@direct2culture.com" href="mailto:partners@direct2culture.com" />
              </div>

              <div className="mt-10 border-t border-ink/15 pt-8">
                <p className="eyebrow">Studio</p>
                <p className="mt-3 font-sans text-base text-ink/80 leading-relaxed">
                  No fixed address. We work between New York, Los Angeles, and on the road.
                </p>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Channel({ label, value, href }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <a href={href} className="mt-1 block font-sans text-lg font-medium text-ink hover:underline">
        {value} →
      </a>
    </div>
  );
}
