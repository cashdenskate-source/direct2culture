import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { submitStorySubmission, submitCreatorVideo } from '../lib/stories.js';
import { notifyNewStorySubmission, notifyNewVideoSubmission } from '../lib/notifications.js';
import { sendWebhook } from '../lib/webhooks.js';
import { trackCTA } from '../lib/tracking.js';

const CATEGORIES = [
  'Artist', 'Producer', 'DJ', 'Designer', 'Founder', 'Director', 'Skater', 'Creative Director',
  'Photographer', 'Editor', 'Model', 'Brand', 'Other',
];

export default function TellYourStory() {
  const [params] = useSearchParams();
  const ref = params.get('ref') || '';

  const [form, setForm] = useState({
    name: '', email: '', instagram: '', website: '',
    category: '', city: '',
    whatYouDo: '', whatBuilding: '', yourStory: '', whyCover: '',
    imageURL: '', videoURL: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return setState({ status: 'error', message: 'Name and email required.' });
    }
    if (!form.category) {
      return setState({ status: 'error', message: 'Pick a category.' });
    }
    if (!form.yourStory.trim()) {
      return setState({ status: 'error', message: 'Tell us your story.' });
    }

    setState({ status: 'loading', message: '' });
    try {
      const payload = {
        ...form,
        referrer: ref,
        hasImage: !!imageFile,
        hasVideo: !!videoFile,
        imageFileName: imageFile?.name || '',
        videoFileName: videoFile?.name || '',
      };
      await submitStorySubmission(payload);
      notifyNewStorySubmission(payload).catch(() => {});
      sendWebhook('new_story_submission', payload).catch(() => {});
      trackCTA('tell_your_story_click', { category: form.category });

      setForm({ name: '', email: '', instagram: '', website: '', category: '', city: '', whatYouDo: '', whatBuilding: '', yourStory: '', whyCover: '', imageURL: '', videoURL: '' });
      setImageFile(null); setVideoFile(null);
      setState({ status: 'success', message: "Your story has been received. If it fits the culture, we'll be in touch." });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Submit failed.' });
    }
  }

  async function submitVideo(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return setState({ status: 'error', message: 'Need at least a name + email for video submissions.' });
    }
    setState({ status: 'loading', message: '' });
    try {
      const payload = {
        name: form.name, email: form.email, category: form.category,
        hasVideo: !!videoFile, videoFileName: videoFile?.name || '',
        referrer: ref,
      };
      await submitCreatorVideo(payload);
      notifyNewVideoSubmission(payload).catch(() => {});
      sendWebhook('new_video_submission', payload).catch(() => {});
      trackCTA('creator_video_submit');
      setState({ status: 'success', message: 'Video submission received.' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Submit failed.' });
    }
  }

  return (
    <>
      <SEO
        title="Tell Your Story | Direct2Culture"
        description="Submit your story to Direct2Culture. Artists, brands, DJs, directors, models, editors, photographers, founders, skaters — get featured."
      />
      <div className="container-edge py-12 lg:py-16 max-w-3xl">
        <PageHeader
          eyebrow={`Direct2Culture / Tell Your Story${ref ? ` · ref: ${ref}` : ''}`}
          title="Tell your story."
          kicker="Artists, brands, DJs, directors, models, editors, photographers, founders, skaters — if you're building something culture-shifting, send it through. We run what fits."
        />

        <form onSubmit={submit} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Name"><input className="field" required value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
          <Field label="Email"><input type="email" className="field" required value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
          <Field label="Instagram"><input className="field" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" /></Field>
          <Field label="Website"><input className="field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" /></Field>
          <Field label="Category">
            <select className="field" value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="">— pick one —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="City"><input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Atlanta, GA" /></Field>

          <Field label="What do you do?" full>
            <textarea className="field min-h-[80px] resize-none" value={form.whatYouDo} onChange={(e) => update('whatYouDo', e.target.value)} placeholder="One paragraph." />
          </Field>
          <Field label="What are you building?" full>
            <textarea className="field min-h-[80px] resize-none" value={form.whatBuilding} onChange={(e) => update('whatBuilding', e.target.value)} placeholder="The world, the project, the movement." />
          </Field>
          <Field label="What is your story?" full>
            <textarea className="field min-h-[140px] resize-none" required value={form.yourStory} onChange={(e) => update('yourStory', e.target.value)} placeholder="Origin → the work → what comes next." />
          </Field>
          <Field label="Why should Direct2Culture cover you?" full>
            <textarea className="field min-h-[100px] resize-none" value={form.whyCover} onChange={(e) => update('whyCover', e.target.value)} />
          </Field>

          <Field label="Upload image (placeholder)" full>
            <div className="border border-ink/15 p-4 flex items-center gap-4">
              <label className="cursor-pointer border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
                {imageFile ? 'Change' : 'Upload Image'} →
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                {imageFile ? imageFile.name : 'no file selected'}
              </span>
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-ash">Storage hookup pending — filename is captured for now.</p>
          </Field>

          <Field label="Upload video (placeholder)" full>
            <div className="border border-ink/15 p-4 flex items-center gap-4">
              <label className="cursor-pointer border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
                {videoFile ? 'Change' : 'Upload Video'} →
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                {videoFile ? videoFile.name : 'no file selected'}
              </span>
            </div>
          </Field>

          <div className="sm:col-span-2 flex items-center justify-between pt-2">
            <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-green-700' : 'text-red-500'}`}>
              {state.message}
            </p>
            <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
              {state.status === 'loading' ? 'Submitting…' : 'Submit Your Story →'}
            </button>
          </div>
        </form>

        {/* Video-only submission widget */}
        <section className="mt-20 border-t border-ink/10 pt-12">
          <p className="eyebrow">Video Submission</p>
          <h2 className="mt-2 font-sans text-3xl font-black tracking-tight">Drop a 10-20 second video.</h2>
          <p className="mt-3 text-ink/80 leading-relaxed">Say something like:</p>
          <blockquote className="mt-4 border-l-4 border-ink pl-6 py-2 text-lg leading-relaxed">
            "My name is [name].
            <br />I'm a [artist / designer / DJ / founder / creator].
            <br />I'm telling my story on Direct2Culture."
          </blockquote>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Vertical · 10-20 sec · raw</p>

          <form onSubmit={submitVideo} className="mt-6 border border-ink/15 p-6 bg-ink/[0.02]">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              Re-uses your name + email + category from the form above. Add your video file below.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <label className="cursor-pointer border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
                {videoFile ? 'Change Video' : 'Pick Video File'} →
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                {videoFile ? videoFile.name : 'no file selected'}
              </span>
            </div>
            <button type="submit" disabled={state.status === 'loading'} className="mt-4 btn-primary disabled:opacity-50">
              {state.status === 'loading' ? 'Submitting…' : 'Submit Video →'}
            </button>
          </form>
        </section>

        <div className="mt-16">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← Back home</Link>
        </div>
      </div>
    </>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
