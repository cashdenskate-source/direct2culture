import ContentManager from '../../components/admin/ContentManager.jsx';

const fields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'role', label: 'Role', placeholder: 'Founder, Crossfade Studio' },
  { key: 'location', label: 'Location', placeholder: 'Brooklyn, NY' },
  { key: 'accent', label: 'Accent / Number', placeholder: 'IV / 01' },
  { key: 'quote', label: 'Pull Quote', type: 'textarea', full: true, rows: 4, required: true, placeholder: 'The one line that captures it.' },
  { key: 'body', label: 'Interview Body (optional)', type: 'textarea', full: true, rows: 8, placeholder: 'Long-form transcript or article.' },
];

export default function AdminInterviews() {
  return (
    <ContentManager
      collection="interviews"
      eyebrow="Admin / Interviews"
      title="Interviews."
      kicker="Editorial conversations on record."
      fields={fields}
      listPreview={(r) => r.name}
    />
  );
}
