import { useEffect, useState } from 'react';
import { hasFirebaseConfig } from '../lib/firebase.js';
import { fetchRatingsForContent, fetchUserRating } from '../lib/identityGraph.js';

export function useContentRating({ contentId, userId }) {
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) return;
    let cancelled = false;

    async function load() {
      if (!hasFirebaseConfig) {
        if (!cancelled) {
          setRatings([]);
          setUserRating(null);
          setLoading(false);
        }
        return;
      }
      try {
        const [all, mine] = await Promise.all([
          fetchRatingsForContent(contentId),
          userId ? fetchUserRating(contentId, userId) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setRatings(all);
        setUserRating(mine);
      } catch {
        if (!cancelled) {
          setRatings([]);
          setUserRating(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [contentId, userId]);

  const count = ratings.length;
  const sum = ratings.reduce((s, r) => s + (r.rating || 0), 0);
  const average = count > 0 ? sum / count : 0;

  function applyOptimisticRating(rating) {
    setUserRating({ rating });
    setRatings((prev) => {
      const without = prev.filter((r) => r.userId !== userId);
      return [...without, { userId, rating }];
    });
  }

  return { average, count, userRating, loading, applyOptimisticRating };
}
