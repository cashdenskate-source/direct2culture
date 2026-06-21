import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AdminSettings() {
  const { user, profile, role } = useAuth();

  return (
    <PageShell eyebrow="Admin / Settings" title="System." kicker="Account and platform info.">
      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <Row title="Signed in as">
          <p className="font-sans text-lg">{profile?.name || user?.email}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash mt-1">{user?.email}</p>
        </Row>
        <Row title="Role">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em]">{role}</p>
        </Row>
        <Row title="To promote a user">
          <p className="text-ink/70 text-sm">
            Open the Firebase Console → Firestore → <code className="font-mono text-xs bg-ink/5 px-1.5 py-0.5">users</code> → find the user doc → change <code className="font-mono text-xs bg-ink/5 px-1.5 py-0.5">role</code> to <code className="font-mono text-xs bg-ink/5 px-1.5 py-0.5">admin</code> or <code className="font-mono text-xs bg-ink/5 px-1.5 py-0.5">editor</code>.
          </p>
        </Row>
        <Row title="Public site">
          <a href="/" className="font-mono text-[11px] uppercase tracking-[0.25em] hover:underline">View site →</a>
        </Row>
      </div>
    </PageShell>
  );
}

function Row({ title, children }) {
  return (
    <div className="border border-ink/15 p-6">
      <p className="eyebrow">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
