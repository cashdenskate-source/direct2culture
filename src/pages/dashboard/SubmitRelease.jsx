import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';
import { createRelease } from '../../lib/releases.js';
import { uploadAvatar } from '../../lib/auth.js'; // reused for cover image upload

export default function SubmitRelease() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    title: '', type: 'song', releaseDate: '', description: '',
    spotifyURL: '', appleMusicURL: '', youtubeURL: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });
  const [mine, setMine] = useState([]);

  useEffect(() => {
    if (!user || !hasFirebaseConfig || !db) return;
    const q = query(
      collection(db, 'releases'),
      where('artistUid', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setMine(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function onCover(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setState({ status: 'error', message: 'Cover must be under 5MB.' });
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setState({ status: 'error', message: 'Title required.' });
    if (!form.releaseDate) return setState({ status: 'error', message: 'Release date required.' });
    setState({ status: 'loading', message: '' });
    try {
      let coverURL = '';
      if (coverFile) {
        // reuse avatar uploader path namespace
        coverURL = await uploadAvatar(user.uid + '_cover_' + Date.now(), coverFile);
      }
      await createRelease({
        ...form,
        coverURL,
        artistUid: user.uid,
        artistName: profile?.name || user.email,
        status: 'pending',
      });
      setForm({ title: '', type: 'song', releaseDate: '', description: '', spotifyURL: '', appleMusicURL: '', youtubeURL: '' });
      setCoverFile(null); setCoverPreview('');
      setState({ status: 'success', message: 'Submitted. Awaiting editorial approval.' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Submit failed.' });
    }
  }

  return (
    <PageShell
      eyebrow="Customer / Submit Release"
      title="Drop a tape or song."
      kicker="Set a release date, add a cover, and we'll feature it on the Upcoming chart so fans can pre-save."
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
        <Field label="Cover Art" full>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
              {coverPreview ? (
                <img src={coverPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-ash">none</div>
              )}
            </div>
            <label className="cursor-pointer border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone">
              {coverFile ? 'Change' : 'Upload Cover'} →
              <input type="file" accept="image/*" onChange={onCover} className="hidden" />
            </label>
          </div>
        </Field>
        <Field label="Title">
          <input className="field" required value={form.title} onChange={(e) => update('title', e.target.value)} />
        </Field>
        <Field label="Type">
          <select className="field" value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="song">Single</option>
            <option value="tape">Mixtape</option>
            <option value="ep">EP</option>
            <option value="album">Album</option>
          </select>
        </Field>
        <Field label="Release Date & Time">
          <input type="datetime-local" className="field" required value={form.releaseDate} onChange={(e) => update('releaseDate', e.target.value)} />
        </Field>
        <Field label="Description" full>
          <textarea className="field min-h-[100px] resize-none" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What is it about? Features? Producers?" />
        </Field>
        <Field label="Spotify (pre-save link)">
          <input className="field" value={form.spotifyURL} onChange={(e) => update('spotifyURL', e.target.value)} placeholder="https://open.spotify.com/..." />
        </Field>
        <Field label="Apple Music">
          <input className="field" value={form.appleMusicURL} onChange={(e) => update('appleMusicURL', e.target.value)} placeholder="https://music.apple.com/..." />
        </Field>
        <Field label="YouTube">
          <input className="field" value={form.youtubeURL} onChange={(e) => update('youtubeURL', e.target.value)} placeholder="https://youtube.com/..." />
        </Field>

        <div className="sm:col-span-2 flex items-center justify-between pt-2">
          <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-ink' : 'text-red-500'}`}>
            {state.message}
          </p>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
            {state.status === 'loading' ? 'Submitting…' : 'Submit Release →'}
          </button>
        </div>
      </form>

      {mine.length > 0 && (
        <div className="mt-16">
          <h2 className="font-sans text-2xl font-black tracking-tight border-b border-ink pb-3">Your releases</h2>
          <ul className="divide-y divide-ink/10">
            {mine.map((r) => (
              <li key={r.id} className="py-4 flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden border border-ink/10 bg-ink/5">
                  {r.coverURL ? <img src={r.coverURL} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold tracking-tight truncate">{r.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                    {r.type} · {r.releaseDate?.toDate ? r.releaseDate.toDate().toLocaleString() : ''}
                  </p>
                </div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-1 border ${
                  r.status === 'approved' ? 'border-green-700 text-green-700' :
                  r.status === 'rejected' ? 'border-red-600 text-red-600' :
                  r.status === 'live' ? 'border-ink bg-ink text-bone' :
                  'border-ash text-ash'
                }`}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageShell>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
