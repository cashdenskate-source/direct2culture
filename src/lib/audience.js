// Identity Graph engagement layer.
// Pure analytics functions + Firestore-backed trackers.
// Consumers load users + events via useAudienceData() and pass them in here.

import {
  COLLECTIONS,
  createContactRequest,
  recordFanEvent,
} from './identityGraph.js';
import { trackCTA } from './tracking.js';

export const ACTION = {
  STORY_VIEWED: 'storyViewed',
  STORY_SAVED: 'storySaved',
  CREATOR_FOLLOWED: 'creatorFollowed',
  ARTIST_FOLLOWED: 'artistFollowed',
  BRAND_FOLLOWED: 'brandFollowed',
  SONG_SAVED: 'songSaved',
  MUSIC_LINK_CLICKED: 'musicLinkClicked',
  EVENT_JOINED: 'eventJoined',
  DROP_WAITLIST_JOINED: 'dropWaitlistJoined',
  NEWSLETTER_SUBSCRIBED: 'newsletterSubscribed',
};

export const ENTITY = {
  STORY: 'story',
  CREATOR: 'creator',
  ARTIST: 'artist',
  BRAND: 'brand',
  SONG: 'song',
  EVENT: 'event',
  DROP: 'drop',
  NEWSLETTER: 'newsletter',
};

export const ACTION_LABEL = {
  storyViewed: 'Story viewed',
  storySaved: 'Story saved',
  creatorFollowed: 'Creator followed',
  artistFollowed: 'Artist followed',
  brandFollowed: 'Brand followed',
  songSaved: 'Song saved',
  musicLinkClicked: 'Music link clicked',
  eventJoined: 'Event joined',
  dropWaitlistJoined: 'Drop waitlist joined',
  newsletterSubscribed: 'Newsletter subscribed',
};

// --- Reads (pure) ---

export function userById(users = [], id) {
  return users.find((u) => u.id === id) || null;
}

export function eventsForUser(events = [], userId) {
  return events
    .filter((e) => e.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

// Tier-1 enforcement: strip email/phone unless the viewer has been granted contact.
export function maskUserContact(user, { canSeeContact = false } = {}) {
  if (!user) return null;
  if (canSeeContact) return user;
  return { ...user, email: null, phone: null };
}

// --- Analytics (pure) ---

export function analyze(users = [], events = []) {
  const totalFans = users.length;

  const weekCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newFansThisWeek = users.filter(
    (u) => new Date(u.createdAt).getTime() >= weekCutoff
  ).length;

  const countByAction = (action) =>
    events.filter((e) => e.actionType === action).length;

  const cityCounts = {};
  for (const u of users) cityCounts[u.city] = (cityCounts[u.city] || 0) + 1;
  const total = users.length || 1;
  const topCityPercentages = Object.entries(cityCounts)
    .map(([city, n]) => ({ city, pct: (n / total) * 100, count: n }))
    .sort((a, b) => b.pct - a.pct);

  const engagementCounts = {};
  for (const e of events)
    engagementCounts[e.userId] = (engagementCounts[e.userId] || 0) + 1;
  const mostEngagedUsers = Object.entries(engagementCounts)
    .map(([userId, count]) => ({ user: userById(users, userId), count }))
    .filter((row) => row.user)
    .sort((a, b) => b.count - a.count);

  function topByAction(action) {
    const counts = {};
    for (const e of events.filter((ev) => ev.actionType === action)) {
      counts[e.entityName] = (counts[e.entityName] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  return {
    totalFans,
    newFansThisWeek,
    musicLinkClicks: countByAction(ACTION.MUSIC_LINK_CLICKED),
    storySaves: countByAction(ACTION.STORY_SAVED),
    storyViews: countByAction(ACTION.STORY_VIEWED),
    waitlistSignups: countByAction(ACTION.DROP_WAITLIST_JOINED),
    newsletterSubscribers: countByAction(ACTION.NEWSLETTER_SUBSCRIBED),
    topCityPercentages,
    mostEngagedUsers,
    topStoriesRead: topByAction(ACTION.STORY_VIEWED),
    topSongsClicked: topByAction(ACTION.MUSIC_LINK_CLICKED),
    topCreatorsFollowed: topByAction(ACTION.CREATOR_FOLLOWED),
    topBrandsFollowed: topByAction(ACTION.BRAND_FOLLOWED),
  };
}

// --- Trackers (write to Firestore + ga/cta stub) ---

async function track({ user, entityType, entityId, entityName, actionType, platform = 'web' }) {
  if (!user) return;
  const payload = {
    userId: user.id || user.uid,
    userName: user.name || '',
    entityType,
    entityId,
    entityName,
    actionType,
    platform,
    city: user.city || '',
  };
  trackCTA(`engagement_${actionType}`, payload);
  await recordFanEvent(payload);
}

export const trackStoryView = ({ user, storyId, storyName, platform }) =>
  track({ user, entityType: ENTITY.STORY, entityId: storyId, entityName: storyName, actionType: ACTION.STORY_VIEWED, platform });

export const trackStorySave = ({ user, storyId, storyName, platform }) =>
  track({ user, entityType: ENTITY.STORY, entityId: storyId, entityName: storyName, actionType: ACTION.STORY_SAVED, platform });

export const trackCreatorFollow = ({ user, creatorId, creatorName, platform }) =>
  track({ user, entityType: ENTITY.CREATOR, entityId: creatorId, entityName: creatorName, actionType: ACTION.CREATOR_FOLLOWED, platform });

export const trackMusicClick = ({ user, songId, songName, platform }) =>
  track({ user, entityType: ENTITY.SONG, entityId: songId, entityName: songName, actionType: ACTION.MUSIC_LINK_CLICKED, platform });

export const trackWaitlistJoin = ({ user, dropId, dropName, platform }) =>
  track({ user, entityType: ENTITY.DROP, entityId: dropId, entityName: dropName, actionType: ACTION.DROP_WAITLIST_JOINED, platform });

export const trackNewsletterSignup = ({ user, newsletterId, newsletterName, platform }) =>
  track({ user, entityType: ENTITY.NEWSLETTER, entityId: newsletterId, entityName: newsletterName, actionType: ACTION.NEWSLETTER_SUBSCRIBED, platform });

// --- Consent ---

export async function requestFanContact({ creator, fan, message }) {
  return await createContactRequest({
    creatorId: creator?.id || creator?.uid || 'creator_unknown',
    creatorName: creator?.name || 'Creator',
    fanId: fan?.id || fan?.uid,
    fanName: fan?.name || '',
    message,
  });
}

export { COLLECTIONS };
