import ContentManager from '../../components/admin/ContentManager.jsx';

const CATEGORIES = ['Fashion', 'Music', 'Skate', 'Digital', 'Merch', 'Other'];
const DROP_STATUS = ['upcoming', 'live', 'sold out'];

const fields = [
  { key: 'name', label: 'Drop Name', required: true },
  { key: 'brand', label: 'Brand or Artist', required: true },
  { key: 'category', label: 'Category', type: 'select', options: CATEGORIES, required: true },
  { key: 'dropStatus', label: 'Drop Status', type: 'select', options: DROP_STATUS },
  { key: 'date', label: 'Drop Date', type: 'date' },
  { key: 'cta', label: 'CTA Label', placeholder: 'Notify Me' },
  { key: 'accent', label: 'Accent / Number', placeholder: 'DR / 01' },
];

export default function AdminDrops() {
  return (
    <ContentManager
      collection="drops"
      eyebrow="Admin / Drops"
      title="Drops."
      kicker="Fashion, music, merch, digital, events."
      fields={fields}
      listPreview={(r) => `${r.brand || ''} — ${r.name || ''}`}
    />
  );
}
