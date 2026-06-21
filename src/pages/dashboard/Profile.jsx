import { useState, useEffect } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { updateUserProfile, uploadAvatar } from '../../lib/auth.js';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', bio: '', city: '', website: '', instagram: '',
    userType: 'fan',
    spotifyURL: '', appleMusicURL: '', youtubeURL: '', soundcloudURL: '', audiomackURL: '',
    instagramURL: '', tiktokURL: '', twitterURL: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        city: profile.city || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
        userType: profile.userType || 'fan',
        spotifyURL: profile.spotifyURL || '',
        appleMusicURL: profile.appleMusicURL || '',
        youtubeURL: profile.youtubeURL || '',
        soundcloudURL: profile.soundcloudURL || '',
        audiomackURL: profile.audiomackURL || '',
        instagramURL: profile.instagramURL || '',
        tiktokURL: profile.tiktokURL || '',
        twitterURL: profile.twitterURL || '',
      });
      setPhotoPreview(profile.photoURL || '');
    }
  }, [profile]);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setState({ status: 'error', message: 'Photo must be under 5MB.' });
    if (!file.type.startsWith('image/')) return setState({ status: 'error', message: 'Photo must be an image.' });
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setState({ status: 'idle', message: '' });
  }

  async function onSave(e) {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const patch = { ...form };
      if (photoFile) {
        patch.photoURL = await uploadAvatar(user.uid, photoFile);
      }
      await updateUserProfile(user.uid, patch);
      await refreshProfile();
      setPhotoFile(null);
      setState({ status: 'success', message: 'Profile saved.' });
    } catch {
      setState({ status: 'error', message: 'Save failed.' });
    }
  }

  return (
    <PageShell
      eyebrow="Customer / Profile"
      title="Your profile."
      kicker="Used when editorial considers your submissions."
    >
      <form onSubmit={onSave} className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
        <Field label="Profile Picture" full>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
                  none
                </div>
              )}
            </div>
            <label className="cursor-pointer border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
              {photoPreview ? 'Change' : 'Upload'} →
              <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            </label>
          </div>
        </Field>
        <Field label="Name">
          <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input type="tel" className="field" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555 555 5555" />
        </Field>
        <Field label="Email">
          <input className="field opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
        </Field>
        <Field label="City">
          <input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Where you are based" />
        </Field>
        <Field label="Website">
          <input className="field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" />
        </Field>
        <Field label="Instagram">
          <input className="field" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" />
        </Field>
        <Field label="I am a…">
          <div className="grid grid-cols-3 gap-2">
            {['artist', 'producer', 'model', 'brand', 'fan'].map((t) => (
              <button type="button" key={t} onClick={() => update('userType', t)}
                className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  form.userType === t ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Account Role">
          <input className="field opacity-60 cursor-not-allowed" value={profile?.role || '—'} disabled />
        </Field>
        <Field label="Short Bio" full>
          <textarea className="field min-h-[120px] resize-none" rows={4} value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="One paragraph. What you do, where you are going." />
        </Field>

        {(form.userType === 'artist' || form.userType === 'producer') && (
          <>
            <div className="sm:col-span-2 mt-4 border-t border-ink/10 pt-6">
              <p className="eyebrow">Music Links</p>
            </div>
            <Field label="Spotify">
              <input className="field" value={form.spotifyURL} onChange={(e) => update('spotifyURL', e.target.value)} placeholder="https://open.spotify.com/artist/..." />
            </Field>
            <Field label="Apple Music">
              <input className="field" value={form.appleMusicURL} onChange={(e) => update('appleMusicURL', e.target.value)} placeholder="https://music.apple.com/..." />
            </Field>
            <Field label="YouTube">
              <input className="field" value={form.youtubeURL} onChange={(e) => update('youtubeURL', e.target.value)} placeholder="https://youtube.com/..." />
            </Field>
            <Field label="SoundCloud">
              <input className="field" value={form.soundcloudURL} onChange={(e) => update('soundcloudURL', e.target.value)} placeholder="https://soundcloud.com/..." />
            </Field>
            <Field label="Audiomack">
              <input className="field" value={form.audiomackURL} onChange={(e) => update('audiomackURL', e.target.value)} placeholder="https://audiomack.com/..." />
            </Field>
          </>
        )}

        <div className="sm:col-span-2 mt-4 border-t border-ink/10 pt-6">
          <p className="eyebrow">Social Links</p>
        </div>
        <Field label="Instagram URL">
          <input className="field" value={form.instagramURL} onChange={(e) => update('instagramURL', e.target.value)} placeholder="https://instagram.com/handle" />
        </Field>
        <Field label="TikTok">
          <input className="field" value={form.tiktokURL} onChange={(e) => update('tiktokURL', e.target.value)} placeholder="https://tiktok.com/@handle" />
        </Field>
        <Field label="Twitter / X">
          <input className="field" value={form.twitterURL} onChange={(e) => update('twitterURL', e.target.value)} placeholder="https://x.com/handle" />
        </Field>

        <div className="sm:col-span-2 flex items-center justify-between pt-2">
          <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${state.status === 'success' ? 'text-ink' : 'text-red-500'}`}>
            {state.message}
          </p>
          <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-50">
            {state.status === 'loading' ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
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
