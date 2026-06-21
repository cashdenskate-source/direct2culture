import ContentManager from '../../components/admin/ContentManager.jsx';

const fields = [
  { key: 'name', label: 'Event Name', required: true, full: true },
  { key: 'city', label: 'City', required: true },
  { key: 'venue', label: 'Venue', placeholder: 'The Lash, DTLA' },
  { key: 'date', label: 'Event Date', type: 'date' },
  { key: 'accent', label: 'Accent / Number', placeholder: 'EV / 01' },
  { key: 'description', label: 'Description', type: 'textarea', full: true, rows: 4, required: true, placeholder: 'What is happening, who is invited, what to expect.' },
];

export default function AdminEvents() {
  return (
    <ContentManager
      collection="events"
      eyebrow="Admin / Events"
      title="Events."
      kicker="Listening parties, showrooms, sessions, screenings."
      fields={fields}
      listPreview={(r) => r.name}
    />
  );
}
