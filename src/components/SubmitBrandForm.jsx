import { useState } from 'react';
import { submitToCollection } from '../lib/firebase.js';

const empty = {
  name: '',
  email: '',
  instagram: '',
  brand: '',
  category: '',
  city: '',
  website: '',
  building: '',
  pitch: '',
  imageName: '',
};

export default function SubmitBrandForm() {
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email required.';
    if (!form.brand.trim()) return 'Brand or project name required.';
    if (!form.category.trim()) return 'Select a category.';
    if (!form.building.trim()) return 'Tell us what you are building.';
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setState({ status: 'error', message: err });
      return;
    }
    setState({ status: 'loading', message: '' });
    try {
      await submitToCollection('submissions', {
        ...form,
        type: 'brand',
        title: form.brand,
        status: 'submitted',
        ownerUid: null,
        ownerEmail: form.email,
        ownerName: form.name,
        building: form.building,
        pitch: form.pitch,
      });
      setState({
        status: 'success',
        message: 'Your submission has been received. If it fits the culture, we will be in touch.',
      });
      setForm(empty);
    } catch {
      setState({ status: 'error', message: 'Submission failed. Please try again.' });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="border border-ink p-10 sm:p-14 bg-bone">
        <p className="eyebrow">D2C / Received</p>
        <h3 className="display-md mt-4">Submission received.</h3>
        <p className="mt-4 max-w-xl text-ink/70 text-lg">{state.message}</p>
        <button
          onClick={() => setState({ status: 'idle', message: '' })}
          className="btn-ghost mt-8"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Field label="Name" required>
        <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />
      </Field>
      <Field label="Email" required>
        <input type="email" className="field" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
      </Field>
      <Field label="Instagram">
        <input className="field" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" />
      </Field>
      <Field label="Brand or Project Name" required>
        <input className="field" value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder="What is it called" />
      </Field>
      <Field label="Category" required>
        <select className="field" value={form.category} onChange={(e) => update('category', e.target.value)}>
          <option value="">Select a category</option>
          <option>Fashion</option>
          <option>Music</option>
          <option>Skate</option>
          <option>Founder</option>
          <option>Creator</option>
          <option>Event</option>
          <option>Other</option>
        </select>
      </Field>
      <Field label="City">
        <input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Where you are based" />
      </Field>
      <Field label="Website">
        <input className="field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" />
      </Field>
      <Field label="Image Upload (optional)">
        <label className="field flex cursor-pointer items-center justify-between text-ash/80">
          <span>{form.imageName || 'Attach an image (placeholder)'}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Upload</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => update('imageName', e.target.files?.[0]?.name || '')}
          />
        </label>
      </Field>

      <Field label="What are you building?" full required>
        <textarea
          className="field min-h-[120px] resize-none"
          rows={4}
          value={form.building}
          onChange={(e) => update('building', e.target.value)}
          placeholder="Describe what you are building in plain language."
        />
      </Field>

      <Field label="Why should Direct2Culture cover you?" full>
        <textarea
          className="field min-h-[120px] resize-none"
          rows={4}
          value={form.pitch}
          onChange={(e) => update('pitch', e.target.value)}
          placeholder="What makes this a signal worth documenting?"
        />
      </Field>

      <div className="sm:col-span-2 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          By submitting you agree to be contacted by Direct2Culture.
        </p>
        <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
          {state.status === 'loading' ? 'Submitting…' : 'Submit Brand →'}
        </button>
      </div>

      {state.status === 'error' && (
        <p className="sm:col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-red-500">{state.message}</p>
      )}
    </form>
  );
}

function Field({ label, required, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="field-label">
        {label} {required && <span className="text-ink">*</span>}
      </label>
      {children}
    </div>
  );
}
