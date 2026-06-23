import { useEffect, useState } from 'react';
import { mockFans, seedEvents } from '../data/identityGraphMock.js';
import { hasFirebaseConfig } from '../lib/firebase.js';
import {
  fetchContactGrantsForCreator,
  fetchFanEvents,
  fetchFanUsers,
} from '../lib/identityGraph.js';

// Loads fan users + events from Firestore.
// Falls back to mock data when Firebase isn't configured OR no fans exist yet
// (so the dashboard always has something to show during demos / pre-launch).
export function useAudienceData({ creatorId } = {}) {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [grantedFanIds, setGrantedFanIds] = useState(new Set());
  const [source, setSource] = useState('mock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!hasFirebaseConfig) {
        if (cancelled) return;
        setUsers(mockFans);
        setEvents(seedEvents);
        setGrantedFanIds(new Set());
        setSource('mock');
        setLoading(false);
        return;
      }

      try {
        const [u, e, grants] = await Promise.all([
          fetchFanUsers(),
          fetchFanEvents(),
          creatorId ? fetchContactGrantsForCreator(creatorId) : Promise.resolve([]),
        ]);
        if (cancelled) return;
        if (u.length === 0) {
          setUsers(mockFans);
          setEvents(seedEvents);
          setSource('mock');
        } else {
          setUsers(u);
          setEvents(e);
          setSource('firestore');
        }
        setGrantedFanIds(new Set(grants.map((g) => g.fanId)));
      } catch {
        if (cancelled) return;
        setUsers(mockFans);
        setEvents(seedEvents);
        setGrantedFanIds(new Set());
        setSource('mock');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  return { users, events, grantedFanIds, source, loading };
}
