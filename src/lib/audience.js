// Identity Graph engagement layer. In-memory mock; swap for Firestore later.
import { trackCTA } from './tracking.js';
import { mockFans, seedEvents } from '../data/identityGraphMock.js';

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

const users = [...mockFans];
const events = [...seedEvents];
let seq = 0;
const newId = () => `evt_${Date.now()}_${seq++}`;

function record({ user, entityType, entityId, entityName, actionType, platform = 'web' }) {
  const e = {
    id: newId(),
    userId: user.id,
    userName: user.name,
    entityType,
    entityId,
    entityName,
    actionType,
    platform,
    city: user.city,
    timestamp: new Date(),
  };
  events.push(e);
  trackCTA(`engagement_${actionType}`, { userId: user.id, entityType, entityId, entityName });
  return e;
}

export function trackStoryView({ user, storyId, storyName, platform }) {
  return record({ user, entityType: ENTITY.STORY, entityId: storyId, entityName: storyName, actionType: ACTION.STORY_VIEWED, platform });
}

export function trackStorySave({ user, storyId, storyName, platform }) {
  return record({ user, entityType: ENTITY.STORY, entityId: storyId, entityName: storyName, actionType: ACTION.STORY_SAVED, platform });
}

export function trackCreatorFollow({ user, creatorId, creatorName, platform }) {
  return record({ user, entityType: ENTITY.CREATOR, entityId: creatorId, entityName: creatorName, actionType: ACTION.CREATOR_FOLLOWED, platform });
}

export function trackMusicClick({ user, songId, songName, platform }) {
  return record({ user, entityType: ENTITY.SONG, entityId: songId, entityName: songName, actionType: ACTION.MUSIC_LINK_CLICKED, platform });
}

export function trackWaitlistJoin({ user, dropId, dropName, platform }) {
  return record({ user, entityType: ENTITY.DROP, entityId: dropId, entityName: dropName, actionType: ACTION.DROP_WAITLIST_JOINED, platform });
}

export function trackNewsletterSignup({ user, newsletterId, newsletterName, platform }) {
  return record({ user, entityType: ENTITY.NEWSLETTER, entityId: newsletterId, entityName: newsletterName, actionType: ACTION.NEWSLETTER_SUBSCRIBED, platform });
}

// --- Reads ---

export function allUsers() { return [...users]; }
export function allEvents() { return [...events]; }
export function userById(id) { return users.find((u) => u.id === id) || null; }
export function eventsForUser(userId) {
  return events
    .filter((e) => e.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// --- Analytics ---

export function totalFans() { return users.length; }

export function newFansThisWeek() {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return users.filter((u) => new Date(u.createdAt).getTime() >= cutoff).length;
}

export function countByAction(action) {
  return events.filter((e) => e.actionType === action).length;
}

export function musicLinkClicks() { return countByAction(ACTION.MUSIC_LINK_CLICKED); }
export function storySaves() { return countByAction(ACTION.STORY_SAVED); }
export function storyViews() { return countByAction(ACTION.STORY_VIEWED); }
export function waitlistSignups() { return countByAction(ACTION.DROP_WAITLIST_JOINED); }
export function newsletterSubscribers() { return countByAction(ACTION.NEWSLETTER_SUBSCRIBED); }

export function topCityPercentages() {
  const counts = {};
  for (const u of users) counts[u.city] = (counts[u.city] || 0) + 1;
  const total = users.length || 1;
  return Object.entries(counts)
    .map(([city, n]) => ({ city, pct: (n / total) * 100, count: n }))
    .sort((a, b) => b.pct - a.pct);
}

export function mostEngagedUsers() {
  const counts = {};
  for (const e of events) counts[e.userId] = (counts[e.userId] || 0) + 1;
  return Object.entries(counts)
    .map(([userId, count]) => ({ user: userById(userId), count }))
    .filter((row) => row.user)
    .sort((a, b) => b.count - a.count);
}

function topByAction(action) {
  const counts = {};
  for (const e of events.filter((ev) => ev.actionType === action)) {
    counts[e.entityName] = (counts[e.entityName] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function topStoriesRead() { return topByAction(ACTION.STORY_VIEWED); }
export function topSongsClicked() { return topByAction(ACTION.MUSIC_LINK_CLICKED); }
export function topCreatorsFollowed() { return topByAction(ACTION.CREATOR_FOLLOWED); }
export function topBrandsFollowed() { return topByAction(ACTION.BRAND_FOLLOWED); }
