import { useEffect, useState } from 'react';
import { listAll } from '../lib/firestore.js';
import { hasFirebaseConfig } from '../lib/firebase.js';

export default function usePublishedContent(collectionName, fallback) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      setItems(fallback);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const rows = await listAll(collectionName, { orderField: 'createdAt' });
        const published = rows.filter((r) => r.status === 'published' || r.status === 'featured');
        if (!cancelled) {
          published.sort((a, b) => (a.status === 'featured' ? -1 : 0) - (b.status === 'featured' ? -1 : 0));
          setItems(published.length ? published : fallback);
        }
      } catch {
        if (!cancelled) setItems(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [collectionName]);

  return { items, loading };
}
