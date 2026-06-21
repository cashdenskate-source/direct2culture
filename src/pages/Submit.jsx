import PageHeader from '../components/PageHeader.jsx';
import SubmitBrandForm from '../components/SubmitBrandForm.jsx';
import SEO from '../components/SEO.jsx';

export default function Submit() {
  return (
    <>
      <SEO
        title="Submit Your Brand | Direct2Culture"
        description="Submit your brand, project, music, event, or creator profile for coverage by Direct2Culture."
      />
      <PageHeader
        eyebrow="05 / Submit"
        title="Building something next?"
        kicker="If it fits the culture we will be in touch. We look at every submission."
        meta="Avg response: 5–7 days"
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <p className="eyebrow">What we cover</p>
              <ul className="mt-5 space-y-4">
                {[
                  ['01', 'Independent brands building from the source'],
                  ['02', 'Artists and labels with point of view'],
                  ['03', 'Skaters, filmers, and skate culture'],
                  ['04', 'Founders shaping the next wave'],
                  ['05', 'Creators with sustained perspective'],
                  ['06', 'Events, pop ups, and listening parties'],
                ].map(([n, t]) => (
                  <li key={n} className="flex gap-4 border-t border-ink/10 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash mt-1">{n}</span>
                    <p className="font-sans text-base text-ink/85 leading-snug">{t}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                Editorial decisions are independent. We do not run paid coverage.
              </p>
            </aside>

            <div className="lg:col-span-8">
              <SubmitBrandForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
