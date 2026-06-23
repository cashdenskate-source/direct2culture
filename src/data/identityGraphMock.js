// Mock data for the Direct2Culture Identity Graph MVP.
// Replace with Firestore reads when the backend lands.

const day = 24 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const minute = 60 * 1000;
const now = Date.now();

export const cashden = {
  id: 'creator_cashden',
  name: 'Cashden',
  email: 'cashden@direct2culture.com',
  city: 'New York',
  instagram: '@cashden',
  interests: ['fashion', 'music', 'culture'],
  favoriteArtists: [],
  favoriteBrands: [],
  favoriteDJs: [],
  favoriteCreators: [],
  newsletterPreferences: ['Culture Brief'],
  createdAt: new Date(now - 120 * day),
};

export const mockFans = [
  {
    id: 'fan_jordan',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    city: 'New York',
    instagram: '@jordanlee',
    interests: ['streetwear', 'hip-hop'],
    favoriteArtists: ['GENZ'],
    favoriteBrands: ['RichSkater'],
    favoriteDJs: [],
    favoriteCreators: ['Cashden', 'Neno'],
    newsletterPreferences: ['Culture Brief'],
    createdAt: new Date(now - 2 * day),
  },
  {
    id: 'fan_maya',
    name: 'Maya Carter',
    email: 'maya.carter@example.com',
    city: 'Los Angeles',
    instagram: '@mayacarter',
    interests: ['fashion', 'r&b'],
    favoriteArtists: ['GENZ'],
    favoriteBrands: [],
    favoriteDJs: [],
    favoriteCreators: ['Cashden'],
    newsletterPreferences: ['Culture Brief'],
    createdAt: new Date(now - 5 * day),
  },
  {
    id: 'fan_chris',
    name: 'Chris Stone',
    email: 'chris.stone@example.com',
    city: 'Atlanta',
    instagram: '@chrisstone',
    interests: ['skate', 'streetwear'],
    favoriteArtists: ['GENZ'],
    favoriteBrands: ['RichSkater'],
    favoriteDJs: [],
    favoriteCreators: [],
    newsletterPreferences: [],
    createdAt: new Date(now - 11 * day),
  },
  {
    id: 'fan_ari',
    name: 'Ari Brooks',
    email: 'ari.brooks@example.com',
    city: 'New York',
    instagram: '@aribrooks',
    interests: ['culture', 'design'],
    favoriteArtists: [],
    favoriteBrands: ['RichSkater'],
    favoriteDJs: [],
    favoriteCreators: ['Cashden'],
    newsletterPreferences: [],
    createdAt: new Date(now - 4 * day),
  },
  {
    id: 'fan_devon',
    name: 'Devon Miles',
    email: 'devon.miles@example.com',
    city: 'Chicago',
    instagram: '@devonmiles',
    interests: ['music', 'film'],
    favoriteArtists: ['GENZ'],
    favoriteBrands: [],
    favoriteDJs: [],
    favoriteCreators: ['Cashden'],
    newsletterPreferences: ['Culture Brief'],
    createdAt: new Date(now - 1 * day),
  },
];

function evt(id, fanIndex, entityType, entityId, entityName, actionType, ago) {
  const fan = mockFans[fanIndex];
  return {
    id,
    userId: fan.id,
    userName: fan.name,
    entityType,
    entityId,
    entityName,
    actionType,
    platform: 'web',
    city: fan.city,
    timestamp: new Date(now - ago),
  };
}

export const seedEvents = [
  // Jordan
  evt('e1', 0, 'story', 'story_cashden_intro', 'Cashden: Culture Before The Algorithm', 'storyViewed', 2 * hour),
  evt('e2', 0, 'song', 'song_genz_spotify', 'GENZ on Spotify', 'musicLinkClicked', 2 * hour),
  evt('e3', 0, 'song', 'song_genz', 'GENZ', 'songSaved', 1 * hour + 50 * minute),
  evt('e4', 0, 'drop', 'drop_richskater', 'RichSkater', 'dropWaitlistJoined', 1 * hour + 30 * minute),
  evt('e5', 0, 'newsletter', 'newsletter_culture_brief', 'Culture Brief', 'newsletterSubscribed', 1 * hour + 20 * minute),
  evt('e6', 0, 'creator', 'creator_neno', 'Neno', 'creatorFollowed', 1 * hour),
  evt('e7', 0, 'brand', 'brand_richskater', 'RichSkater', 'brandFollowed', 50 * minute),
  // Maya
  evt('e8', 1, 'story', 'story_cashden_intro', 'Cashden: Culture Before The Algorithm', 'storyViewed', 6 * hour),
  evt('e9', 1, 'song', 'song_genz_spotify', 'GENZ on Spotify', 'musicLinkClicked', 5 * hour + 50 * minute),
  evt('e10', 1, 'creator', 'creator_cashden', 'Cashden', 'creatorFollowed', 5 * hour),
  evt('e11', 1, 'newsletter', 'newsletter_culture_brief', 'Culture Brief', 'newsletterSubscribed', 4 * hour + 30 * minute),
  // Chris
  evt('e12', 2, 'song', 'song_genz', 'GENZ', 'songSaved', 1 * day),
  evt('e13', 2, 'brand', 'brand_richskater', 'RichSkater', 'brandFollowed', 22 * hour),
  // Ari
  evt('e14', 3, 'story', 'story_cashden_intro', 'Cashden: Culture Before The Algorithm', 'storyViewed', 10 * hour),
  evt('e15', 3, 'drop', 'drop_richskater', 'RichSkater', 'dropWaitlistJoined', 9 * hour + 30 * minute),
  evt('e16', 3, 'story', 'story_cashden_intro', 'Cashden: Culture Before The Algorithm', 'storySaved', 9 * hour),
  // Devon
  evt('e17', 4, 'newsletter', 'newsletter_culture_brief', 'Culture Brief', 'newsletterSubscribed', 18 * hour),
  evt('e18', 4, 'creator', 'creator_cashden', 'Cashden', 'creatorFollowed', 17 * hour),
  evt('e19', 4, 'song', 'song_genz_spotify', 'GENZ on Spotify', 'musicLinkClicked', 16 * hour),
];
