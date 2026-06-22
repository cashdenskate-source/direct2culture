import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { getCurated, setCurated } from '../../lib/stories.js';
import { singleOfTheWeek, dropOfTheWeek } from '../../data/homepageFeatureData.js';
import { featuredStory } from '../../data/storyData.js';
import { creators } from '../../data/creatorData.js';
import { stories } from '../../data/storyData.js';

export default function AdminCuration() {
  const [form, setForm] = useState({
    singleTicker: singleOfTheWeek.songTicker,
    singleTitle: singleOfTheWeek.title,
    singleArtist: singleOfTheWeek.artistName,
    singleStreams: singleOfTheWeek.streams,
    singleGrowth7d: singleOfTheWeek.growth7d,
    singleSpins: singleOfTheWeek.djSpins,
    singleCultureScore: singleOfTheWeek.cultureScore,
    dropBrand: dropOfTheWeek.brand,
    dropTitle: dropOfTheWeek.drop,
    dropCategory: dropOfTheWeek.category,
    dropStatus: dropOfTheWeek.status,
    dropCultureScore: dropOfTheWeek.cultureScore,
    featuredKind: featuredStory.type,
    featuredSlug: featuredStory.slug,
  });
  const [state, setState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    (async () => {
      const c = await getCurated();
      if (c) setForm((f) => ({ ...f, ...c }));
    })();
  }, []);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function save() {
    setState({ status: 'loading', message: '' });
    try {
      await setCurated(form);
      setState({ status: 'success', message: 'Saved. Curation lives in featuredContent/weekly.' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Save failed.' });
    }
  }

  return (
    <PageShell
      eyebrow="Admin / Curation"
      title="Weekly picks."
      kicker="Set the Single of the Week, Drop of the Week, and Featured Story. Writes to Firestore featuredContent/weekly."
    >
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Single of the Week */}
        <section className="border border-ink/15 p-6">
          <p className="eyebrow">Single of the Week</p>
          <h2 className="mt-2 font-sans text-2xl font-black tracking-tight">$ {form.singleTicker}</h2>
          <div className="mt-5 space-y-3">
            <Input label="Song Ticker" v={form.singleTicker} on={(v) => update('singleTicker', v.toUpperCase())} />
            <Input label="Title" v={form.singleTitle} on={(v) => update('singleTitle', v)} />
            <Input label="Artist" v={form.singleArtist} on={(v) => update('singleArtist', v)} />
            <Input label="Streams" type="number" v={form.singleStreams} on={(v) => update('singleStreams', v)} />
            <Input label="7-day growth %" type="number" v={form.singleGrowth7d} on={(v) => update('singleGrowth7d', v)} />
            <Input label="DJ Spins" type="number" v={form.singleSpins} on={(v) => update('singleSpins', v)} />
            <Input label="Culture Score" type="number" v={form.singleCultureScore} on={(v) => update('singleCultureScore', v)} />
          </div>
        </section>

        {/* Drop of the Week */}
        <section className="border border-ink/15 p-6">
          <p className="eyebrow">Drop of the Week</p>
          <h2 className="mt-2 font-sans text-2xl font-black tracking-tight">{form.dropTitle}</h2>
          <div className="mt-5 space-y-3">
            <Input label="Brand" v={form.dropBrand} on={(v) => update('dropBrand', v)} />
            <Input label="Drop Title" v={form.dropTitle} on={(v) => update('dropTitle', v)} />
            <Input label="Category" v={form.dropCategory} on={(v) => update('dropCategory', v)} />
            <Input label="Status" v={form.dropStatus} on={(v) => update('dropStatus', v)} />
            <Input label="Culture Score" type="number" v={form.dropCultureScore} on={(v) => update('dropCultureScore', v)} />
          </div>
        </section>

        {/* Featured Story */}
        <section className="border border-ink/15 p-6">
          <p className="eyebrow">Featured Story</p>
          <h2 className="mt-2 font-sans text-2xl font-black tracking-tight">{form.featuredKind} · {form.featuredSlug}</h2>
          <div className="mt-5 space-y-3">
            <div>
              <label className="field-label">Kind</label>
              <select className="field" value={form.featuredKind} onChange={(e) => update('featuredKind', e.target.value)}>
                <option value="creator">Creator profile</option>
                <option value="story">Story (RichSkater / BarelySain)</option>
              </select>
            </div>
            <div>
              <label className="field-label">Slug</label>
              <select className="field" value={form.featuredSlug} onChange={(e) => update('featuredSlug', e.target.value)}>
                {form.featuredKind === 'creator'
                  ? creators.map((c) => <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>)
                  : stories.map((s) => <option key={s.slug} value={s.slug}>{s.title} ({s.slug})</option>)}
              </select>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              Renders on /stories index + homepage Featured Story slot.
            </p>
            <Link to={form.featuredKind === 'creator' ? `/creator/${form.featuredSlug}` : `/stories/${form.featuredSlug}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
              Preview ↗
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6">
        <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-700' : 'text-red-500'}`}>
          {state.message}
        </p>
        <button onClick={save} disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
          {state.status === 'loading' ? 'Saving…' : 'Save Curation →'}
        </button>
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
        Note: homepage currently reads defaults from <code>src/data/homepageFeatureData.js</code>.
        Saved curation lands in Firestore <code>featuredContent/weekly</code> — homepage wiring to pull from Firestore is the next step.
      </p>
    </PageShell>
  );
}

function Input({ label, v, on, type = 'text' }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input type={type} className="field" value={v ?? ''} onChange={(e) => on(type === 'number' ? Number(e.target.value) : e.target.value)} />
    </div>
  );
}
