import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { createDoc, logActivity } from '../../lib/firestore.js';

const TYPES = [
  { id: 'brand', label: 'Brand or Project' },
  { id: 'drop', label: 'Drop' },
  { id: 'event', label: 'Event' },
  { id: 'interview', label: 'Interview Request' },
];

const empty = {
  type: 'brand',
  brand: '',
  title: '',
  category: '',
  city: '',
  date: '',
  venue: '',
  website: '',
  instagram: '',
  building: '',
  pitch: '',
  imageName: '',
};

export default function NewSubmission({ defaultType }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    const t = defaultType || params.get('type');
    if (t && TYPES.find((x) => x.id === t)) {
      setForm((f) => ({ ...f, type: t }));
    }
  }, [defaultType, params]);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function validate() {
    if (form.type === 'brand' && !form.brand.trim()) return 'Brand name is required.';
    if (form.type === 'drop' && !form.title.trim()) return 'Drop name is required.';
    if (form.type === 'event' && !form.title.trim()) return 'Event name is required.';
    if (form.type === 'interview' && !form.brand.trim() && !form.title.trim()) return 'Subject of interview required.';
    if (!form.category.trim()) return 'Category is required.';
    if (!form.building.trim()) return 'Tell us what you are building.';
    return null;
  }

  async function save(status) {
    const err = status !== 'draft' && validate();
    if (err) {
      setState({ status: 'error', message: err });
      return;
    }
    setState({ status: 'loading', message: '' });
    try {
      const payload = {
        ...form,
        ownerUid: user.uid,
        ownerEmail: user.email,
        ownerName: profile?.name || '',
        status,
      };
      const id = await createDoc('submissions', payload);
      await logActivity(user.uid, 'submission.create', { id, type: form.type, status });
      navigate('/dashboard/submissions', { replace: true });
    } catch (e) {
      setState({ status: 'error', message: 'Could not save. Try again.' });
    }
  }

  const isInterview = form.type === 'interview';
  const isEvent = form.type === 'event';
  const isDrop = form.type === 'drop';
  const isBrand = form.type === 'brand';

  return (
    <PageShell
      eyebrow="Customer / New Submission"
      title="Submit your work."
      kicker="Be specific. Editorial reads every line."
    >
      <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Type" required>
          <select className="field" value={form.type} onChange={(e) => update('type', e.target.value)}>
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>

        <Field label="Category" required>
          <select className="field" value={form.category} onChange={(e) => update('category', e.target.value)}>
            <option value="">Select</option>
            {['Fashion', 'Music', 'Skate', 'Founder', 'Creator', 'Event', 'Internet', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        {(isBrand || isInterview) && (
          <Field label={isBrand ? 'Brand or Project Name' : 'Person or Project'} required>
            <input className="field" value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder={isInterview ? 'Who or what to interview' : 'Brand name'} />
          </Field>
        )}

        {(isDrop || isEvent) && (
          <Field label={isDrop ? 'Drop Name' : 'Event Name'} required>
            <input className="field" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder={isDrop ? 'What is dropping' : 'What is the event called'} />
          </Field>
        )}

        <Field label="City">
          <input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Where" />
        </Field>

        {(isDrop || isEvent) && (
          <Field label={isDrop ? 'Drop Date' : 'Event Date'}>
            <input type="date" className="field" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </Field>
        )}

        {isEvent && (
          <Field label="Venue">
            <input className="field" value={form.venue} onChange={(e) => update('venue', e.target.value)} placeholder="Where is it" />
          </Field>
        )}

        <Field label="Website">
          <input className="field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" />
        </Field>

        <Field label="Instagram">
          <input className="field" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" />
        </Field>

        <Field label="Image (optional)">
          <label className="field flex cursor-pointer items-center justify-between text-ash/80">
            <span>{form.imageName || 'Attach an image (placeholder)'}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Upload</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => update('imageName', e.target.files?.[0]?.name || '')} />
          </label>
        </Field>

        <Field label={isInterview ? 'Why this person?' : 'What are you building?'} full required>
          <textarea
            className="field min-h-[120px] resize-none"
            rows={4}
            value={form.building}
            onChange={(e) => update('building', e.target.value)}
            placeholder="Describe the work in plain language."
          />
        </Field>

        <Field label="Why should Direct2Culture cover this?" full>
          <textarea
            className="field min-h-[120px] resize-none"
            rows={4}
            value={form.pitch}
            onChange={(e) => update('pitch', e.target.value)}
            placeholder="What makes this a real signal?"
          />
        </Field>

        <div className="sm:col-span-2 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => save('draft')} disabled={state.status === 'loading'} className="btn-ghost">
            Save as Draft
          </button>
          <button type="button" onClick={() => save('submitted')} disabled={state.status === 'loading'} className="btn-primary">
            {state.status === 'loading' ? 'Saving…' : 'Submit for Review →'}
          </button>
        </div>

        {state.message && (
          <p className="sm:col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-red-500">{state.message}</p>
        )}
      </form>
    </PageShell>
  );
}

function Field({ label, required, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="field-label">{label} {required && <span className="text-ink">*</span>}</label>
      {children}
    </div>
  );
}
