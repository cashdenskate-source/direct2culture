import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { subscribeCreatives, createCreative, updateCreative, deleteCreative, CATEGORIES } from '../../lib/creatives.js';
import { formatNum } from '../../lib/market.js';

const EMPTY = {
  name: '', ticker: '', category: 'model', city: '', bio: '', photoURL: '',
  projects: 0, bookings: 0, followers: 0, totalViews: 0, growthScore: 0, cultureScore: 0,
  verified: false, instagramURL: '', tiktokURL: '', portfolioURL: '', featured: false,
};

export default function AdminCreatives() {
  const [creatives, setCreatives] = useState([]);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const unsub = subscribeCreatives(filter || null, setCreatives);
    return () => unsub();
  }, [filter]);

  async function save() {
    const { id, data } = editing;
    if (id) await updateCreative(id, data);
    else await createCreative(data);
    setEditing(null);
  }
  async function onDel(id) { if (!confirm('Delete?')) return; await deleteCreative(id); }

  return (
    <PageShell eyebrow="Admin / Creatives" title="Creative Stock Exchange." kicker="Models, directors, editors, photographers.">
      <div className="border-b border-ink/10 pb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <FilterBtn active={!filter} onClick={() => setFilter('')}>All · {creatives.length}</FilterBtn>
          {CATEGORIES.map((c) => (
            <FilterBtn key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</FilterBtn>
          ))}
        </div>
        <button onClick={() => setEditing({ data: { ...EMPTY } })} className="btn-primary">+ Creative →</button>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead><tr className="border-b border-ink/10"><Th>Ticker</Th><Th>Name</Th><Th>Cat</Th><Th>City</Th><Th className="text-right">Followers</Th><Th className="text-right">Culture</Th><Th></Th></tr></thead>
        <tbody>
          {creatives.map((c) => (
            <tr key={c.id} className="border-b border-ink/5">
              <Td><span className="font-mono font-bold">${c.ticker}{c.verified && <span className="ml-1 text-blue-600">✓</span>}</span></Td>
              <Td>{c.name}</Td>
              <Td className="text-ash">{c.category}</Td>
              <Td className="text-ash">{c.city}</Td>
              <Td className="text-right tabular-nums">{formatNum(c.followers)}</Td>
              <Td className="text-right tabular-nums">{c.cultureScore || 0}</Td>
              <Td className="text-right">
                <Link to={`/market/creative/${c.ticker}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">View ↗</Link>
                <button onClick={() => setEditing({ id: c.id, data: { ...c } })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">Edit</button>
                <button onClick={() => onDel(c.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">Delete</button>
              </Td>
            </tr>
          ))}
          {creatives.length === 0 && <tr><td colSpan={7} className="py-6 text-ink/60">No creatives yet.</td></tr>}
        </tbody>
      </table>

      {editing && (
        <Modal title={`${editing.id ? 'Edit' : 'New'} creative`} onClose={() => setEditing(null)} onSave={save}>
          <Input label="Name" v={editing.data.name} on={(v) => upd('name', v)} />
          <Input label="Ticker" v={editing.data.ticker} on={(v) => upd('ticker', v.toUpperCase())} />
          <div><label className="field-label">Category</label>
            <select className="field" value={editing.data.category} onChange={(e) => upd('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="City" v={editing.data.city} on={(v) => upd('city', v)} />
          <Input label="Photo URL" v={editing.data.photoURL} on={(v) => upd('photoURL', v)} />
          <Input label="Instagram URL" v={editing.data.instagramURL} on={(v) => upd('instagramURL', v)} />
          <Input label="TikTok URL" v={editing.data.tiktokURL} on={(v) => upd('tiktokURL', v)} />
          <Input label="Portfolio URL" v={editing.data.portfolioURL} on={(v) => upd('portfolioURL', v)} />
          <div><label className="field-label">Bio</label><textarea className="field min-h-[80px]" value={editing.data.bio} onChange={(e) => upd('bio', e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Projects" type="number" v={editing.data.projects} on={(v) => upd('projects', v)} />
            <Input label="Bookings" type="number" v={editing.data.bookings} on={(v) => upd('bookings', v)} />
            <Input label="Followers" type="number" v={editing.data.followers} on={(v) => upd('followers', v)} />
            <Input label="Total Views" type="number" v={editing.data.totalViews} on={(v) => upd('totalViews', v)} />
            <Input label="Growth %" type="number" v={editing.data.growthScore} on={(v) => upd('growthScore', v)} />
            <Input label="Culture Score" type="number" v={editing.data.cultureScore} on={(v) => upd('cultureScore', v)} />
          </div>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
            <input type="checkbox" checked={!!editing.data.verified} onChange={(e) => upd('verified', e.target.checked)} />
            Verified ✓
          </label>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
            <input type="checkbox" checked={!!editing.data.featured} onChange={(e) => upd('featured', e.target.checked)} />
            Featured pick
          </label>
        </Modal>
      )}
    </PageShell>
  );

  function upd(k, v) { setEditing((e) => ({ ...e, data: { ...e.data, [k]: v } })); }
}

function FilterBtn({ active, children, onClick }) {
  return <button onClick={onClick} className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${active ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'}`}>{children}</button>;
}
function Th({ children, className = '' }) { return <th className={`font-mono text-[10px] uppercase tracking-[0.25em] text-ash py-3 pr-3 text-left ${className}`}>{children}</th>; }
function Td({ children, className = '' }) { return <td className={`py-3 pr-3 align-middle ${className}`}>{children}</td>; }
function Input({ label, v, on, type = 'text' }) {
  return (<div><label className="field-label">{label}</label><input type={type} className="field" value={v ?? ''} onChange={(e) => on(type === 'number' ? Number(e.target.value) : e.target.value)} /></div>);
}
function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-lg bg-bone border border-ink/10 p-6 max-h-[85vh] overflow-y-auto">
        <h3 className="font-sans text-2xl font-black tracking-tight">{title}</h3>
        <div className="mt-5 space-y-4">{children}</div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">Cancel</button>
          <button onClick={onSave} className="btn-primary">Save →</button>
        </div>
      </div>
    </div>
  );
}
