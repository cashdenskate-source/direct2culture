export default function StatTile({ label, value, sub, accent }) {
  return (
    <div className={`border p-5 ${accent ? 'bg-ink text-bone border-ink' : 'border-ink/15 bg-bone'}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${accent ? 'text-bone/60' : 'text-ash'}`}>{label}</p>
      <p className="mt-3 font-sans text-4xl font-black tracking-tightest leading-none">{value}</p>
      {sub && (
        <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.25em] ${accent ? 'text-bone/60' : 'text-ash'}`}>{sub}</p>
      )}
    </div>
  );
}
