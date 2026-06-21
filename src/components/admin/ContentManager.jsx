import { useEffect, useState, useMemo } from 'react';
import PageShell from '../PageShell.jsx';
import { listAll, createDoc, updateOne, deleteOne, logActivity } from '../../lib/firestore.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const STATUSES = ['draft', 'published', 'featured', 'archived'];

export default function ContentManager({ collection, eyebrow, title, kicker, fields, listPreview }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  async function load() {
    setLoading(true);
    try {
      const r = await listAll(collection, { orderField: 'createdAt' });
      setRows(r);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [collection]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && (r.status || 'draft') !== statusFilter) return false;
      if (!q) return true;
      return Object.values(r).some((v) => (typeof v === 'string' ? v.toLowerCase().includes(q) : false));
    });
  }, [rows, search, statusFilter]);

  function startCreate() {
    const init = fields.reduce((acc, f) => ({ ...acc, [f.key]: f.default ?? '' }), {});
    init.status = 'draft';
    setForm(init);
    setEditing('new');
  }

  function startEdit(row) {
    setForm({ ...row });
    setEditing(row.id);
  }

  function cancel() {
    setEditing(null);
    setForm({});
  }

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function save() {
    const payload = { ...form };
    delete payload.id;
    delete payload.createdAt;
    delete payload.updatedAt;
    if (editing === 'new') {
      const id = await createDoc(collection, payload);
      await logActivity(user.uid, `${collection}.create`, { id });
    } else {
      await updateOne(collection, editing, payload);
      await logActivity(user.uid, `${collection}.update`, { id: editing });
    }
    cancel();
    await load();
  }

  async function remove(id) {
    if (!confirm('Delete this item permanently?')) return;
    await deleteOne(collection, id);
    await logActivity(user.uid, `${collection}.delete`, { id });
    await load();
  }

  async function setStatus(id, status) {
    await updateOne(collection, id, { status });
    await load();
  }

  return (
    <PageShell
      eyebrow={eyebrow}
      title={title}
      kicker={kicker}
      actions={editing == null && <button onClick={startCreate} className="btn-primary">New +</button>}
    >
      {editing != null ? (
        <Editor form={form} fields={fields} onChange={update} onSave={save} onCancel={cancel} isNew={editing === 'new'} />
      ) : (
        <>
          <div className="flex flex-wrap gap-3 border-b border-ink/10 pb-6">
            <input className="field max-w-sm" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="field max-w-[180px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-ink/60">Nothing here. Create the first one.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {filtered.map((r) => (
                  <li key={r.id} className="grid grid-cols-12 gap-3 py-4 items-center">
                    <div className="col-span-12 sm:col-span-6">
                      <p className="font-sans font-bold tracking-tight text-lg">{listPreview ? listPreview(r) : (r.title || r.name || 'Untitled')}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                        {r.category || r.role || '—'} {r.city || r.location ? `· ${r.city || r.location}` : ''}
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <span className={`px-2 py-1 border font-mono text-[10px] uppercase tracking-[0.2em] ${r.status === 'published' ? 'bg-ink text-bone border-ink' : r.status === 'featured' ? 'bg-yellow-400 text-ink border-ink' : r.status === 'archived' ? 'bg-ash/10 text-ash border-ash/30' : 'border-ink/30 text-ink'}`}>
                        {r.status || 'draft'}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex gap-2 flex-wrap">
                      {r.status !== 'published' && r.status !== 'featured' && (
                        <button onClick={() => setStatus(r.id, 'published')} className="font-mono text-[10px] uppercase tracking-[0.2em] hover:underline">Publish</button>
                      )}
                      {r.status === 'published' && (
                        <button onClick={() => setStatus(r.id, 'featured')} className="font-mono text-[10px] uppercase tracking-[0.2em] hover:underline">Feature</button>
                      )}
                      {(r.status === 'published' || r.status === 'featured') && (
                        <button onClick={() => setStatus(r.id, 'archived')} className="font-mono text-[10px] uppercase tracking-[0.2em] hover:underline">Archive</button>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-2 sm:text-right flex gap-3 sm:justify-end">
                      <button onClick={() => startEdit(r)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
                        Edit
                      </button>
                      <button onClick={() => remove(r.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </PageShell>
  );
}

function Editor({ form, fields, onChange, onSave, onCancel, isNew }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <p className="eyebrow">{isNew ? 'New entry' : 'Edit entry'}</p>
        <button onClick={onCancel} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
          Cancel ✕
        </button>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(); }}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {fields.map((f) => (
          <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
            <label className="field-label">{f.label}{f.required && <span> *</span>}</label>
            {f.type === 'textarea' ? (
              <textarea rows={f.rows || 4} className="field min-h-[120px] resize-none" required={f.required} value={form[f.key] || ''} onChange={(e) => onChange(f.key, e.target.value)} placeholder={f.placeholder || ''} />
            ) : f.type === 'select' ? (
              <select className="field" required={f.required} value={form[f.key] || ''} onChange={(e) => onChange(f.key, e.target.value)}>
                <option value="">Select</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} className="field" required={f.required} value={form[f.key] || ''} onChange={(e) => onChange(f.key, e.target.value)} placeholder={f.placeholder || ''} />
            )}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="field-label">Status</label>
          <select className="field max-w-xs" value={form.status || 'draft'} onChange={(e) => onChange('status', e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">{isNew ? 'Create' : 'Save'} →</button>
        </div>
      </form>
    </div>
  );
}
