// Firestore-backed reads/writes for the Identity Graph.
// Falls back gracefully when Firebase isn't configured (returns empty arrays).
import { hasFirebaseConfig } from './firebase.js';
import { createDoc, listAll, listWhere, setDocById, updateOne } from './firestore.js';

export const COLLECTIONS = {
  USERS: 'fan_users',
  EVENTS: 'fan_events',
  CONTACT_REQUESTS: 'fan_contact_requests',
  CONTACT_GRANTS: 'fan_contact_grants',
  RATINGS: 'fan_ratings',
};

const ratingDocId = (contentId, userId) => `${contentId}__${userId}`;

export async function fetchFanUsers() {
  if (!hasFirebaseConfig) return [];
  try {
    return await listAll(COLLECTIONS.USERS, { orderField: 'createdAt' });
  } catch {
    return [];
  }
}

export async function fetchFanEvents() {
  if (!hasFirebaseConfig) return [];
  try {
    return await listAll(COLLECTIONS.EVENTS, { orderField: 'timestamp' });
  } catch {
    return [];
  }
}

export async function fetchContactGrantsForCreator(creatorId) {
  if (!hasFirebaseConfig || !creatorId) return [];
  try {
    return await listWhere(COLLECTIONS.CONTACT_GRANTS, [
      ['creatorId', '==', creatorId],
      ['status', '==', 'granted'],
    ]);
  } catch {
    return [];
  }
}

export async function recordFanEvent(payload) {
  if (!hasFirebaseConfig) return null;
  return await createDoc(COLLECTIONS.EVENTS, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

export async function upsertFanUser(uid, data) {
  if (!hasFirebaseConfig || !uid) return;
  await setDocById(COLLECTIONS.USERS, uid, data);
}

export async function createContactRequest({ creatorId, creatorName, fanId, fanName, message = '' }) {
  if (!hasFirebaseConfig) {
    if (typeof console !== 'undefined') {
      console.info('[identityGraph] mock contact request', { creatorId, fanId });
    }
    return { ok: true, mock: true };
  }
  const id = await createDoc(COLLECTIONS.CONTACT_REQUESTS, {
    creatorId,
    creatorName,
    fanId,
    fanName,
    message,
    status: 'pending',
  });
  return { ok: true, id };
}

export async function fetchPendingContactRequestsForFan(fanId) {
  if (!hasFirebaseConfig || !fanId) return [];
  try {
    return await listWhere(
      COLLECTIONS.CONTACT_REQUESTS,
      [
        ['fanId', '==', fanId],
        ['status', '==', 'pending'],
      ],
      { orderField: 'createdAt' }
    );
  } catch {
    return [];
  }
}

export async function fetchHandledContactRequestsForFan(fanId) {
  if (!hasFirebaseConfig || !fanId) return [];
  try {
    const all = await listWhere(
      COLLECTIONS.CONTACT_REQUESTS,
      [['fanId', '==', fanId]],
      { orderField: 'createdAt' }
    );
    return all.filter((r) => r.status !== 'pending');
  } catch {
    return [];
  }
}

export async function acceptContactRequest({ requestId, creatorId, creatorName, fanId, fanName }) {
  if (!hasFirebaseConfig) {
    if (typeof console !== 'undefined') console.info('[identityGraph] mock accept', requestId);
    return { ok: true, mock: true };
  }
  await updateOne(COLLECTIONS.CONTACT_REQUESTS, requestId, { status: 'accepted' });
  await createDoc(COLLECTIONS.CONTACT_GRANTS, {
    creatorId,
    creatorName,
    fanId,
    fanName,
    status: 'granted',
    grantedAt: new Date().toISOString(),
  });
  return { ok: true };
}

export async function declineContactRequest(requestId) {
  if (!hasFirebaseConfig) {
    if (typeof console !== 'undefined') console.info('[identityGraph] mock decline', requestId);
    return { ok: true, mock: true };
  }
  await updateOne(COLLECTIONS.CONTACT_REQUESTS, requestId, { status: 'declined' });
  return { ok: true };
}

// One rating per (contentId, userId) — composite id keeps it idempotent.
export async function upsertRating({ contentId, contentType, contentName, userId, userName = '', city = '', rating }) {
  if (!hasFirebaseConfig || !contentId || !userId) return { ok: false };
  await setDocById(COLLECTIONS.RATINGS, ratingDocId(contentId, userId), {
    contentId,
    contentType,
    contentName,
    userId,
    userName,
    city,
    rating,
    ratedAt: new Date().toISOString(),
  });
  return { ok: true };
}

export async function fetchRatingsForContent(contentId) {
  if (!hasFirebaseConfig || !contentId) return [];
  try {
    return await listWhere(COLLECTIONS.RATINGS, [['contentId', '==', contentId]]);
  } catch {
    return [];
  }
}

export async function fetchUserRating(contentId, userId) {
  if (!hasFirebaseConfig || !contentId || !userId) return null;
  try {
    const rows = await listWhere(COLLECTIONS.RATINGS, [
      ['contentId', '==', contentId],
      ['userId', '==', userId],
    ]);
    return rows[0] || null;
  } catch {
    return null;
  }
}
