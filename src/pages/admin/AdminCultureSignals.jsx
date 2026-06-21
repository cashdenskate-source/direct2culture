import ContentManager from '../../components/admin/ContentManager.jsx';

const CATEGORIES = ['Fashion', 'Music', 'Skate', 'Brands', 'Creators', 'Internet', 'Other'];

const fields = [
  { key: 'title', label: 'Title', required: true, full: true, placeholder: 'Headline of the signal' },
  { key: 'category', label: 'Category', type: 'select', options: CATEGORIES, required: true },
  { key: 'accent', label: 'Accent / Number', placeholder: 'CS / 01' },
  { key: 'date', label: 'Date Label', placeholder: 'June 2026' },
  { key: 'description', label: 'Description', type: 'textarea', full: true, rows: 5, placeholder: 'The signal in 2–3 sentences.', required: true },
];

export default function AdminCultureSignals() {
  return (
    <ContentManager
      collection="cultureSignals"
      eyebrow="Admin / Culture Signals"
      title="Culture Signals."
      kicker="Create, edit, publish, feature, archive."
      fields={fields}
      listPreview={(r) => r.title}
    />
  );
}
