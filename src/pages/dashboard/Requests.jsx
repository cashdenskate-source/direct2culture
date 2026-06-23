import { useEffect, useState } from 'react';
import PageShell from '../../components/PageShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  acceptContactRequest,
  declineContactRequest,
  fetchHandledContactRequestsForFan,
  fetchPendingContactRequestsForFan,
} from '../../lib/identityGraph.js';

export default function Requests() {
  const { user, profile } = useAuth();
  const [pending, setPending] = useState([]);
  const [handled, setHandled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [p, h] = await Promise.all([
        fetchPendingContactRequestsForFan(user.uid),
        fetchHandledContactRequestsForFan(user.uid),
      ]);
      if (cancelled) return;
      setPending(p);
      setHandled(h);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function onAccept(req) {
    setBusyId(req.id);
    try {
      await acceptContactRequest({
        requestId: req.id,
        creatorId: req.creatorId,
        creatorName: req.creatorName,
        fanId: user.uid,
        fanName: profile?.name || '',
      });
      setPending((rows) => rows.filter((r) => r.id !== req.id));
      setHandled((rows) => [{ ...req, status: 'accepted' }, ...rows]);
    } finally {
      setBusyId(null);
    }
  }

  async function onDecline(req) {
    setBusyId(req.id);
    try {
      await declineContactRequest(req.id);
      setPending((rows) => rows.filter((r) => r.id !== req.id));
      setHandled((rows) => [{ ...req, status: 'declined' }, ...rows]);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <PageShell
      eyebrow="Account / Contact Requests"
      title="Who wants to reach you."
      kicker="Creators on Direct2Culture can request your email and phone. You decide who gets through."
    >
      <div className="mb-8 border border-ink/15 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          How this works
        </p>
        <p className="mt-3 text-sm text-ink/80 leading-relaxed">
          By default, creators see your name and city but not your email or phone.
          When you accept a request, that creator gains contact access for direct
          email and SMS — only on D2C. You can revoke access anytime from settings.
        </p>
      </div>

      <Section title={`Pending (${pending.length})`}>
        {loading ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Loading…</p>
        ) : pending.length === 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            No pending requests.
          </p>
        ) : (
          <ul className="divide-y divide-ink/10 border border-ink/15">
            {pending.map((req) => (
              <li key={req.id} className="px-5 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-sans font-bold tracking-tight">{req.creatorName}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                      Wants your email + phone
                    </p>
                    {req.message && (
                      <p className="mt-2 text-sm text-ink/80">"{req.message}"</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onDecline(req)}
                      disabled={busyId === req.id}
                      className="btn-ghost disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onAccept(req)}
                      disabled={busyId === req.id}
                      className="btn-primary disabled:opacity-50"
                    >
                      {busyId === req.id ? 'Saving…' : 'Accept →'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="History">
        {handled.length === 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            No past requests.
          </p>
        ) : (
          <ul className="divide-y divide-ink/10 border border-ink/15">
            {handled.map((req) => (
              <li key={req.id} className="grid grid-cols-12 items-center gap-4 px-5 py-3">
                <p className="col-span-12 sm:col-span-6 font-sans font-semibold">{req.creatorName}</p>
                <p className="col-span-6 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                  Wants your email + phone
                </p>
                <p
                  className={`col-span-6 sm:col-span-2 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] ${
                    req.status === 'accepted' ? 'text-ink' : 'text-ash'
                  }`}
                >
                  {req.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-10">
      <p className="eyebrow">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
