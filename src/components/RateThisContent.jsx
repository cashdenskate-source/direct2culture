import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useContentRating } from '../hooks/useContentRating.js';
import { trackContentRating, userFromAuth } from '../lib/audience.js';
import { upsertRating } from '../lib/identityGraph.js';

const OPTIONS = [
  { value: 1, label: 'Cold' },
  { value: 2, label: 'Warm' },
  { value: 3, label: 'Fire' },
];

function labelForAverage(avg) {
  if (!avg) return null;
  if (avg < 1.67) return 'COLD';
  if (avg < 2.34) return 'WARM';
  return 'FIRE';
}

export default function RateThisContent({ contentId, contentType, contentName }) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const { average, count, userRating, applyOptimisticRating } = useContentRating({
    contentId,
    userId: user?.uid,
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedValue = userRating?.rating || 0;

  async function submit(value) {
    if (!user || submitting) return;
    setSubmitting(true);
    applyOptimisticRating(value);
    try {
      await upsertRating({
        contentId,
        contentType,
        contentName,
        userId: user.uid,
        userName: profile?.name || '',
        city: profile?.city || '',
        rating: value,
      });
      const audUser = userFromAuth(user, profile);
      if (audUser) {
        trackContentRating({
          user: audUser,
          contentId,
          contentName,
          contentType,
          rating: value,
        }).catch(() => {});
      }
    } catch {
      // optimistic update stays; user can retry
    } finally {
      setSubmitting(false);
    }
  }

  const avgLabel = labelForAverage(average);

  return (
    <div className="mt-12 border-t border-ink/10 pt-10">
      <p className="eyebrow">Rate this</p>
      <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight">How did it land?</h3>

      <div className="mt-6 flex flex-wrap gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={!user || submitting}
              onClick={() => submit(opt.value)}
              className={`px-5 py-3 border font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                isSelected
                  ? 'border-ink bg-ink text-bone'
                  : 'border-ink/30 text-ink hover:bg-ink hover:text-bone'
              } ${!user ? 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-ink' : ''}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {!user && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          <Link
            to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
            className="text-ink hover:underline"
          >
            Sign in →
          </Link>{' '}
          to rate this and add it to your fan history.
        </p>
      )}

      {user && selectedValue > 0 && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          You marked this{' '}
          <span className="font-bold text-ink">
            {OPTIONS.find((o) => o.value === selectedValue)?.label.toUpperCase()}
          </span>
          . Tap another to change.
        </p>
      )}

      {count > 0 && avgLabel && (
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
          Average: <span className="font-bold text-ink">{avgLabel}</span> · {count}{' '}
          {count === 1 ? 'fan' : 'fans'}
        </p>
      )}
    </div>
  );
}
