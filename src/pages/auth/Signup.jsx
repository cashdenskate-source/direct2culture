import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/AuthShell.jsx';
import SEO from '../../components/SEO.jsx';
import { signUpCustomer } from '../../lib/auth.js';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    instagram: '',
    password: '',
    confirm: '',
    userType: '',
    tosAccepted: false,
    identityGraphOptIn: true,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return setState({ status: 'error', message: 'Photo must be under 5MB.' });
    }
    if (!file.type.startsWith('image/')) {
      return setState({ status: 'error', message: 'Photo must be an image.' });
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setState({ status: 'idle', message: '' });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setState({ status: 'error', message: 'Name required.' });
    if (!form.userType) return setState({ status: 'error', message: 'Pick what you are.' });
    if (form.password.length < 8) return setState({ status: 'error', message: 'Password must be at least 8 characters.' });
    if (form.password !== form.confirm) return setState({ status: 'error', message: 'Passwords do not match.' });
    if (!form.tosAccepted) return setState({ status: 'error', message: 'You must accept the Terms and Privacy Policy.' });
    if (!form.identityGraphOptIn) return setState({ status: 'error', message: 'You must opt in to the Identity Graph to use D2C.' });

    setState({ status: 'loading', message: '' });
    try {
      const { role } = await signUpCustomer({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        city: form.city,
        instagram: form.instagram,
        userType: form.userType,
        photoFile,
        tosAccepted: form.tosAccepted,
        identityGraphOptIn: form.identityGraphOptIn,
      });
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setState({ status: 'error', message: friendly(err.code) });
    }
  }

  return (
    <>
      <SEO title="Create Account | Direct2Culture" description="Create your Direct2Culture account to submit brands, drops, events, and interview requests." />
      <AuthShell
        eyebrow="Account / Create"
        title="Get on the inside."
        kicker="Build a profile, submit your work, and track your status — direct from the source."
        footer={
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
            Already have an account?{' '}
            <Link to="/login" className="text-ink hover:underline">
              Sign in →
            </Link>
          </p>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="field-label">Full Name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="field" placeholder="Your name" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="field" placeholder="you@email.com" />
          </div>
          <div>
            <label className="field-label">I am a… <span className="text-red-500 normal-case">required</span></label>
            <div className="grid grid-cols-3 gap-2">
              {['artist', 'producer', 'dj', 'model', 'influencer', 'photographer', 'director', 'editor', 'brand', 'fan'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => update('userType', t)}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                    form.userType === t ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="field-label">City <span className="text-ash normal-case">(powers your city stats)</span></label>
              <input value={form.city} onChange={(e) => update('city', e.target.value)} className="field" placeholder="New York" />
            </div>
            <div>
              <label className="field-label">Instagram <span className="text-ash normal-case">(optional)</span></label>
              <input value={form.instagram} onChange={(e) => update('instagram', e.target.value)} className="field" placeholder="@handle" />
            </div>
          </div>
          <div>
            <label className="field-label">Phone <span className="text-ash normal-case">(optional)</span></label>
            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="field" placeholder="+1 555 555 5555" />
          </div>
          <div>
            <label className="field-label">Profile Picture <span className="text-ash normal-case">(optional)</span></label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
                    none
                  </div>
                )}
              </div>
              <label className="cursor-pointer border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
                {photoFile ? 'Change' : 'Upload'} →
                <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} className="field" placeholder="Minimum 8 characters" />
          </div>
          <div>
            <label className="field-label">Confirm Password</label>
            <input type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)} className="field" placeholder="Type it again" />
          </div>

          <div className="space-y-3 border-t border-ink/10 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Consent</p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.tosAccepted}
                onChange={(e) => update('tosAccepted', e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-ink"
              />
              <span className="text-[12px] leading-relaxed text-ink/80">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-ink underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank" className="text-ink underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.identityGraphOptIn}
                onChange={(e) => update('identityGraphOptIn', e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-ink"
              />
              <span className="text-[12px] leading-relaxed text-ink/80">
                Join the <strong>Direct2Culture Identity Graph</strong>. Your name and city
                are visible to creators you engage with on D2C. Your email and phone stay
                private — creators must request and receive your consent to see them.
              </span>
            </label>
          </div>

          <button type="submit" disabled={state.status === 'loading'} className="btn-primary w-full disabled:opacity-50">
            {state.status === 'loading' ? 'Creating…' : 'Create Account →'}
          </button>
          {state.message && (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500">{state.message}</p>
          )}
        </form>
      </AuthShell>
    </>
  );
}

function friendly(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Email already has an account.';
    case 'auth/invalid-email': return 'Email format is invalid.';
    case 'auth/weak-password': return 'Password is too weak.';
    case 'auth/operation-not-allowed': return 'Email/password sign-in is disabled in Firebase Console.';
    case 'tos/not-accepted': return 'You must accept the Terms to create an account.';
    default: return 'Could not create account.';
  }
}
