// Seed podcast episodes. Replace with Firestore-backed admin entries in Phase B.
const day = 24 * 60 * 60 * 1000;
const now = Date.now();

export const podcastEpisodes = [
  {
    id: 'ep-03',
    slug: 'trey-donovan-documenting-your-own-community',
    number: 3,
    season: 1,
    title: 'Documenting Your Own Community',
    guest: 'Trey Donovan',
    guestSlug: 'trey-donovan',
    publishedAt: new Date(now - 1 * day).toISOString(),
    duration: '61:45',
    description:
      'Trey on long-form storytelling in a short-form era, why the doc-style approach beats the vlog, and how to film what you can\'t buy.',
    topics: ['video', 'storytelling', 'craft'],
    spotifyEpisodeURL: '#',
    appleURL: '#',
    youtubeURL: '#',
    accent: 'EP / 03',
  },
  {
    id: 'ep-02',
    slug: 'mira-velasquez-songs-the-algorithm-cant-hear',
    number: 2,
    season: 1,
    title: 'Songs The Algorithm Can\'t Hear',
    guest: 'Mira Velasquez',
    guestSlug: 'mira-velasquez',
    publishedAt: new Date(now - 4 * day).toISOString(),
    duration: '48:02',
    description:
      'NIGHTROOM EP just dropped. Mira on writing for the listener, not the feed, and what changed the day she stopped chasing playlists.',
    topics: ['music', 'songwriting', 'craft'],
    spotifyEpisodeURL: '#',
    appleURL: '#',
    youtubeURL: '#',
    accent: 'EP / 02',
  },
  {
    id: 'ep-01',
    slug: 'cashden-culture-before-the-algorithm',
    number: 1,
    season: 1,
    title: 'Culture Before The Algorithm',
    guest: 'Cashden',
    guestSlug: 'cashden',
    publishedAt: new Date(now - 8 * day).toISOString(),
    duration: '52:18',
    description:
      'Cashden on building Direct2Culture, why streaming numbers lie, and the playbook for owning your audience before the algorithm decides for you.',
    topics: ['identity', 'streaming', 'audience'],
    spotifyEpisodeURL: '#',
    appleURL: '#',
    youtubeURL: '#',
    accent: 'EP / 01',
  },
];

export function episodeBySlug(slug) {
  return podcastEpisodes.find((e) => e.slug === slug) || null;
}

export function latestEpisode() {
  return podcastEpisodes[0] || null;
}
