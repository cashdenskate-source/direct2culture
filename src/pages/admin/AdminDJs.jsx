import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { subscribeDJs, createDJ, updateDJ, deleteDJ } from '../../lib/djs.js';
import { subscribeRecentSpins, logSpin, deleteSpin, recountDJSpins } from '../../lib/spins.js';
import { formatNum } from '../../lib/market.js';

const EMPTY_DJ = {
  name: '', handle: '', city: '', bio: '', photoURL: '',
  genres: [], venues: [],
  totalSpins: 0, influenceScore: 0, cultureScore: 0,
  verified: false,
  instagramURL: '', soundcloudURL: '',
};

export default function AdminDJs() {
  const [tab, setTab] = useState('djs');
  const [djs, setDjs] = useState([]);
  const [spins, setSpins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [spinModal, setSpinModal] = useState(null);

  useEffect(() => {
    const u1 = subscribeDJs(setDjs);
    const u2 = subscribeRecentSpins(setSpins, 100);
    return () => { u1(); u2(); };
  }, []);

  async function saveDJ() {
    const { id, data } = editing;
    const payload = {
      ...data,
      genres: typeof data.genres === 'string' ? data.genres.split(',').map((s) => s.trim()).filter(Boolean) : (data.genres || []),
      venues: typeof data.venues === 'string' ? data.venues.split(',').map((s) => s.trim()).filter(Boolean) : (data.venues || []),
    };
    if (id) await updateDJ(id, payload);
    else await createDJ(payload);
    setEditing(null);
  }

  async function onDeleteDJ(id) {
    if (!confirm('Delete this DJ?')) return;
    await deleteDJ(id);
  }

  async function saveSpin() {
    const { djId, songTitle, songTicker, artistName, venue, city, spunAt, notes } = spinModal;
    const dj = djs.find((d) => d.id === djId);
    await logSpin({
      djId, djName: dj?.name || '', djHandle: dj?.handle || '',
      songTitle, songTicker, artistName, venue, city, spunAt, notes,
    });
    if (dj) {
      const count = await recountDJSpins(dj.id);
      await updateDJ(dj.id, { totalSpins: count });
    }
    setSpinModal(null);
  }

  return (
    <PageShell eyebrow="Admin / DJs" title="DJ Stock Exchange." kicker="Manage DJ profiles and log spins.">
      <div className="border-b border-ink/10 pb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <TabBtn active={tab === 'djs'} onClick={() => setTab('djs')}>DJs · {djs.length}</TabBtn>
          <TabBtn active={tab === 'spins'} onClick={() => setTab('spins')}>Spins · {spins.length}</TabBtn>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSpinModal({ djId: djs[0]?.id || '', songTitle: '', songTicker: '', artistName: '', venue: '', city: '', spunAt: new Date().toISOString().slice(0, 16), notes: '' })} className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone">+ Spin</button>
          <button onClick={() => setEditing({ data: { ...EMPTY_DJ } })} className="btn-primary">+ DJ →</button>
        </div>
      </div>

      {tab === 'djs' ? (
        <table className="mt-6 w-full text-sm">
          <thead><tr className="border-b border-ink/10"><Th>Handle</Th><Th>Name</Th><Th>City</Th><Th className="text-right">Spins</Th><Th className="text-right">Influence</Th><Th></Th></tr></thead>
          <tbody>
            {djs.map((d) => (
              <tr key={d.id} className="border-b border-ink/5">
                <Td><span className="font-mono font-bold">@{d.handle}{d.verified && <span className="ml-1 text-blue-600">✓</span>}</span></Td>
                <Td>{d.name}</Td>
                <Td className="text-ash">{d.city}</Td>
                <Td className="text-right tabular-nums">{formatNum(d.totalSpins)}</Td>
                <Td className="text-right tabular-nums">{d.influenceScore || 0}</Td>
                <Td className="text-right">
                  <Link to={`/market/dj/${d.handle}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">View ↗</Link>
                  <button onClick={() => setEditing({ id: d.id, data: { ...d, genres: (d.genres || []).join(', '), venues: (d.venues || []).join(', ') } })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">Edit</button>
                  <button onClick={() => onDeleteDJ(d.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">Delete</button>
                </Td>
              </tr>
            ))}
            {djs.length === 0 && <tr><td colSpan={6} className="py-6 text-ink/60">No DJs yet. Add one above.</td></tr>}
          </tbody>
        </table>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead><tr className="border-b border-ink/10"><Th>DJ</Th><Th>Song</Th><Th>Venue / City</Th><Th>When</Th><Th></Th></tr></thead>
          <tbody>
            {spins.map((s) => (
              <tr key={s.id} className="border-b border-ink/5">
                <Td className="font-mono">@{s.djHandle}</Td>
                <Td>{s.songTicker ? `$${s.songTicker} · ` : ''}{s.songTitle} <span className="text-ash">· {s.artistName}</span></Td>
                <Td className="text-ash">{s.venue}{s.city ? ` · ${s.city}` : ''}</Td>
                <Td className="text-ash">{s.spunAt?.toDate ? s.spunAt.toDate().toLocaleString() : ''}</Td>
                <Td className="text-right"><button onClick={() => deleteSpin(s.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">Delete</button></Td>
              </tr>
            ))}
            {spins.length === 0 && <tr><td colSpan={5} className="py-6 text-ink/60">No spins yet.</td></tr>}
          </tbody>
        </table>
      )}

      {editing && (
        <Modal title={`${editing.id ? 'Edit' : 'New'} DJ`} onClose={() => setEditing(null)} onSave={saveDJ}>
          <Input label="Name" v={editing.data.name} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, name: v } }))} />
          <Input label="Handle (no @)" v={editing.data.handle} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, handle: v.toLowerCase().replace(/[^a-z0-9_]/g, '') } }))} />
          <Input label="City" v={editing.data.city} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, city: v } }))} />
          <Input label="Photo URL" v={editing.data.photoURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, photoURL: v } }))} />
          <Input label="Genres (comma)" v={editing.data.genres} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, genres: v } }))} />
          <Input label="Venues (comma)" v={editing.data.venues} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, venues: v } }))} />
          <Input label="Instagram URL" v={editing.data.instagramURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, instagramURL: v } }))} />
          <Input label="SoundCloud URL" v={editing.data.soundcloudURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, soundcloudURL: v } }))} />
          <div><label className="field-label">Bio</label><textarea className="field min-h-[80px]" value={editing.data.bio} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, bio: e.target.value } }))} /></div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Total Spins" type="number" v={editing.data.totalSpins} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, totalSpins: v } }))} />
            <Input label="Influence" type="number" v={editing.data.influenceScore} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, influenceScore: v } }))} />
            <Input label="Culture Score" type="number" v={editing.data.cultureScore} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, cultureScore: v } }))} />
          </div>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
            <input type="checkbox" checked={!!editing.data.verified} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, verified: e.target.checked } }))} />
            Verified ✓
          </label>
        </Modal>
      )}

      {spinModal && (
        <Modal title="Log spin" onClose={() => setSpinModal(null)} onSave={saveSpin}>
          <div><label className="field-label">DJ</label>
            <select className="field" value={spinModal.djId} onChange={(e) => setSpinModal((s) => ({ ...s, djId: e.target.value }))}>
              <option value="">— pick DJ —</option>
              {djs.map((d) => <option key={d.id} value={d.id}>@{d.handle} · {d.name}</option>)}
            </select>
          </div>
          <Input label="Song Title" v={spinModal.songTitle} on={(v) => setSpinModal((s) => ({ ...s, songTitle: v }))} />
          <Input label="Song Ticker" v={spinModal.songTicker} on={(v) => setSpinModal((s) => ({ ...s, songTicker: v.toUpperCase() }))} />
          <Input label="Artist" v={spinModal.artistName} on={(v) => setSpinModal((s) => ({ ...s, artistName: v }))} />
          <Input label="Venue" v={spinModal.venue} on={(v) => setSpinModal((s) => ({ ...s, venue: v }))} />
          <Input label="City" v={spinModal.city} on={(v) => setSpinModal((s) => ({ ...s, city: v }))} />
          <Input label="When" type="datetime-local" v={spinModal.spunAt} on={(v) => setSpinModal((s) => ({ ...s, spunAt: v }))} />
          <Input label="Notes" v={spinModal.notes} on={(v) => setSpinModal((s) => ({ ...s, notes: v }))} />
        </Modal>
      )}
    </PageShell>
  );
}

function TabBtn({ active, children, onClick }) {
  return <button onClick={onClick} className={`border-b-2 pb-2 px-1 font-mono text-[10px] uppercase tracking-[0.25em] ${active ? 'border-ink text-ink' : 'border-transparent text-ash hover:text-ink'}`}>{children}</button>;
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
