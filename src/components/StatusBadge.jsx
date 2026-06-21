const styles = {
  draft: 'bg-ash/10 text-ash border-ash/30',
  submitted: 'bg-bone text-ink border-ink/30',
  under_review: 'bg-bone text-ink border-ink/50',
  approved: 'bg-ink text-bone border-ink',
  featured: 'bg-yellow-400 text-ink border-ink',
  rejected: 'bg-red-50 text-red-700 border-red-300',
  needs_edits: 'bg-orange-50 text-orange-700 border-orange-300',
};

const labels = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  featured: 'Featured',
  rejected: 'Rejected',
  needs_edits: 'Needs Edits',
};

export const statusOptions = Object.keys(labels);

export function statusLabel(status) {
  return labels[status] || status;
}

export default function StatusBadge({ status }) {
  const s = styles[status] || styles.submitted;
  return (
    <span className={`inline-block px-2.5 py-1 border font-mono text-[10px] uppercase tracking-[0.2em] ${s}`}>
      {labels[status] || status}
    </span>
  );
}
