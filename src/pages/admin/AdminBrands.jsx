import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import { subscribeBrands, createBrand, updateBrand, deleteBrand, recordBrandSnapshot } from '../../lib/brands.js';
import { formatNum } from '../../lib/market.js';

const EMPTY_BRAND = {
  name: '', ticker: '', logoURL: '', category: 'streetwear', hq: '', founded: '',
  bio: '', followersIG: 0, followersTT: 0, growthPct: 0, trendScore: 0,
  storeURL: '', instagramURL: '', tiktokURL: '', websiteURL: '', shopifyHandle: '',
  featured: false,
};

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);
  const [snapModal, setSnapModal] = useState(null);

  useEffect(() => {
    const unsub = subscribeBrands(setBrands);
    return () => unsub();
  }, []);

  async function saveEditing() {
    const { id, data } = editing;
    if (id) await updateBrand(id, data);
    else await createBrand(data);
    setEditing(null);
  }

  async function onDelete(id) {
    if (!confirm('Delete this brand?')) return;
    await deleteBrand(id);
  }

  async function saveSnapshot() {
    const { brandId, date, followersIG, followersTT, growthPct } = snapModal;
    await recordBrandSnapshot(brandId, date, { followersIG, followersTT, growthPct });
    await updateBrand(brandId, {
      followersIG: Number(followersIG),
      followersTT: Number(followersTT),
      growthPct: Number(growthPct),
    });
    setSnapModal(null);
  }

  return (
    <PageShell eyebrow="Admin / Brands" title="Brand Stock Exchange." kicker="Manage clothing brand listings and metrics.">
      <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">{brands.length} brands listed</p>
        <button onClick={() => setEditing({ data: { ...EMPTY_BRAND } })} className="btn-primary">+ Brand →</button>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10">
            <Th>Ticker</Th><Th>Name</Th><Th>Category</Th>
            <Th className="text-right">IG</Th><Th className="text-right">TT</Th>
            <Th className="text-right">Growth</Th><Th></Th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => (
            <tr key={b.id} className="border-b border-ink/5">
              <Td><span className="font-mono font-bold">${b.ticker}</span></Td>
              <Td className="truncate max-w-[12rem]">{b.name}</Td>
              <Td className="text-ash">{b.category}</Td>
              <Td className="text-right tabular-nums">{formatNum(b.followersIG)}</Td>
              <Td className="text-right tabular-nums">{formatNum(b.followersTT)}</Td>
              <Td className="text-right tabular-nums">{(b.growthPct || 0).toFixed(1)}%</Td>
              <Td className="text-right">
                <Link to={`/market/brand/${b.ticker}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">View ↗</Link>
                <button onClick={() => setSnapModal({
                  brandId: b.id, date: new Date().toISOString().slice(0, 10),
                  followersIG: b.followersIG || 0, followersTT: b.followersTT || 0, growthPct: b.growthPct || 0,
                })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">Snapshot</button>
                <button onClick={() => setEditing({ id: b.id, data: { ...b } })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">Edit</button>
                <button onClick={() => onDelete(b.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">Delete</button>
              </Td>
            </tr>
          ))}
          {brands.length === 0 && (
            <tr><td colSpan={7} className="py-6 text-ink/60">No brands yet. Add one above.</td></tr>
          )}
        </tbody>
      </table>

      {editing && (
        <Modal title={`${editing.id ? 'Edit' : 'New'} brand`} onClose={() => setEditing(null)} onSave={saveEditing}>
          <Input label="Name" v={editing.data.name} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, name: v } }))} />
          <Input label="Ticker (e.g. BSAIN)" v={editing.data.ticker} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, ticker: v.toUpperCase() } }))} />
          <Input label="Logo URL" v={editing.data.logoURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, logoURL: v } }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Category" v={editing.data.category} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, category: v } }))} />
            <Input label="HQ" v={editing.data.hq} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, hq: v } }))} />
            <Input label="Founded" v={editing.data.founded} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, founded: v } }))} />
            <Input label="Trend Score" type="number" v={editing.data.trendScore} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, trendScore: v } }))} />
          </div>
          <div>
            <label className="field-label">Bio</label>
            <textarea className="field min-h-[80px]" value={editing.data.bio} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, bio: e.target.value } }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Instagram followers" type="number" v={editing.data.followersIG} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, followersIG: v } }))} />
            <Input label="TikTok followers" type="number" v={editing.data.followersTT} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, followersTT: v } }))} />
            <Input label="Growth %" type="number" v={editing.data.growthPct} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, growthPct: v } }))} />
          </div>
          <Input label="Store URL" v={editing.data.storeURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, storeURL: v } }))} />
          <Input label="Instagram URL" v={editing.data.instagramURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, instagramURL: v } }))} />
          <Input label="TikTok URL" v={editing.data.tiktokURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, tiktokURL: v } }))} />
          <Input label="Website URL" v={editing.data.websiteURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, websiteURL: v } }))} />
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
            <input type="checkbox" checked={!!editing.data.featured} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, featured: e.target.checked } }))} />
            Direct2Culture Pick (featured)
          </label>
        </Modal>
      )}

      {snapModal && (
        <Modal title="Log brand snapshot" onClose={() => setSnapModal(null)} onSave={saveSnapshot}>
          <Input label="Date (YYYY-MM-DD)" v={snapModal.date} on={(v) => setSnapModal((s) => ({ ...s, date: v }))} />
          <Input label="Instagram followers" type="number" v={snapModal.followersIG} on={(v) => setSnapModal((s) => ({ ...s, followersIG: v }))} />
          <Input label="TikTok followers" type="number" v={snapModal.followersTT} on={(v) => setSnapModal((s) => ({ ...s, followersTT: v }))} />
          <Input label="Growth %" type="number" v={snapModal.growthPct} on={(v) => setSnapModal((s) => ({ ...s, growthPct: v }))} />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Adds a chart point + updates the brand&apos;s current numbers.</p>
        </Modal>
      )}
    </PageShell>
  );
}

function Th({ children, className = '' }) {
  return <th className={`font-mono text-[10px] uppercase tracking-[0.25em] text-ash py-3 pr-3 text-left ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`py-3 pr-3 align-middle ${className}`}>{children}</td>;
}
function Input({ label, v, on, type = 'text' }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input type={type} className="field" value={v ?? ''} onChange={(e) => on(type === 'number' ? Number(e.target.value) : e.target.value)} />
    </div>
  );
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
