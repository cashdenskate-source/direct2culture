// 13 Direct2Culture creators. Stories are placeholder templates — edit per creator.
// Each creator gets a public page at /creator/:slug

export const CREATOR_CATEGORIES = [
  'Artist', 'Producer', 'DJ', 'Designer', 'Founder', 'Director', 'Skater', 'Creative Director',
];

const TEMPLATE_QUOTE = 'Culture starts before the algorithm catches it.';

function story(opts) {
  const {
    id, slug, name, category, city, tagline, shortBio, fullStory,
    origin, work, worldbuilding, whyItMatters, whatsNext,
    instagram, website, cultureScore, status = 'featured',
    isRevealed = false, storyDebutDate = null, teaserText = '',
    blurredName = null,
    spotifyURL = '', appleMusicURL = '', soundcloudURL = '',
    youtubeURL = '', audiomackURL = '', tiktokURL = '',
  } = opts;
  return {
    id, slug, name, category, city,
    tagline: tagline || `${category} from ${city}.`,
    shortBio: shortBio || `${name} is a ${category.toLowerCase()} from ${city} building from the source.`,
    fullStory: fullStory || `Meet ${name}. ${shortBio || ''}`,
    origin: origin || `Started in ${city}. Built it from nothing. Still here.`,
    work: work || `The work speaks for itself. Look closer.`,
    worldbuilding: worldbuilding || `Building a world around the work — community, language, look, sound.`,
    whyItMatters: whyItMatters || `Because culture deserves to be told before the algorithm catches it.`,
    whatsNext: whatsNext || `More work, more world, more reach.`,
    quote: TEMPLATE_QUOTE,
    instagram: instagram || `https://instagram.com/${slug.replace(/-/g, '')}`,
    website: website || '',
    cultureScore: cultureScore ?? 80,
    status,
    imagePlaceholder: '',
    videoPlaceholder: '',
    // Debut system
    isRevealed,
    storyDebutDate, // ISO string, e.g. '2026-07-15T18:00:00Z'
    teaserText: teaserText || 'Story dropping soon. Tap Notify Me to know first.',
    blurredName: blurredName || maskName(name),
    // Media links
    spotifyURL, appleMusicURL, soundcloudURL, youtubeURL, audiomackURL, tiktokURL,
  };
}

function maskName(name) {
  return name.split(' ').map((part) => {
    if (part.length <= 1) return part;
    return part[0] + '·'.repeat(part.length - 1);
  }).join(' ');
}

export const creators = [
  story({ id: 'cee',           slug: 'cee',           name: 'Cee',           category: 'Founder',           city: 'Atlanta',      cultureScore: 88,
    storyDebutDate: futureDate(3), teaserText: 'Founder story — coming soon. Tap Notify Me.' }),
  story({ id: 'smith',         slug: 'smith',         name: 'Smith',         category: 'Designer',          city: 'Atlanta',      cultureScore: 84,
    storyDebutDate: futureDate(5), teaserText: 'Designer reveal — coming soon.' }),
  story({ id: 'boy-floss',     slug: 'boy-floss',     name: 'Boy Floss',     category: 'Artist',            city: 'Atlanta',      cultureScore: 82,
    storyDebutDate: futureDate(8), teaserText: 'Artist story — coming soon.' }),
  story({ id: 'vino',          slug: 'vino',          name: 'Vino',          category: 'Producer',          city: 'Atlanta',      cultureScore: 79,
    storyDebutDate: futureDate(10), teaserText: 'Producer reveal — coming soon.' }),
  story({ id: 'calixte',       slug: 'calixte',       name: 'Calixte',       category: 'Director',          city: 'Atlanta',      cultureScore: 81,
    storyDebutDate: futureDate(12), teaserText: 'Director story — coming soon.' }),
  story({ id: 'slie-q',        slug: 'slie-q',        name: 'Slie Q',        category: 'Artist',            city: 'Atlanta',      cultureScore: 77,
    storyDebutDate: futureDate(15), teaserText: 'Artist story — coming soon.' }),
  story({ id: 'stevie',        slug: 'stevie',        name: 'Stevie',        category: 'Creative Director', city: 'Atlanta',      cultureScore: 86,
    storyDebutDate: futureDate(18), teaserText: 'Creative director story — coming soon.' }),
  story({ id: 'dj-funky',      slug: 'dj-funky',      name: 'DJ Funky',      category: 'DJ',                city: 'Atlanta',      cultureScore: 85,
    storyDebutDate: futureDate(4), teaserText: 'DJ Funky reveal — coming soon.' }),
  story({ id: 'neno',          slug: 'neno',          name: 'Neno',          category: 'Artist',            city: 'Atlanta',      cultureScore: 92,
    tagline: 'The sound, the work, the movement.',
    shortBio: 'Neno is building one of the most distinctive sound worlds out of the South — patient, controlled, designed to last.',
    fullStory: 'Meet Neno. The story behind the sound, the work, and the movement.',
    origin: 'Started recording in bedrooms before any of it had a name. Built the catalog before the audience showed up.',
    work: 'Genre-defying production rooted in melody and texture. Songs that read like films.',
    worldbuilding: 'Visual language, drop strategy, and a creative ecosystem of producers, directors, and stylists. The world arrives with the music.',
    whyItMatters: 'Because what Neno makes is what the algorithm doesn\'t know how to surface yet.',
    whatsNext: 'A debut project, a film, and a tour built around the world the music describes.',
    status: 'featured',
    isRevealed: false,
    storyDebutDate: futureDate(1),
    teaserText: 'The story behind the sound, the work, the movement. Coming soon.',
  }),
  story({ id: 'quay',          slug: 'quay',          name: 'Quay',          category: 'Skater',            city: 'Atlanta',      cultureScore: 78,
    isRevealed: false, storyDebutDate: futureDate(2), teaserText: 'A skater you should know. Story drops soon.',
  }),
  story({ id: 'shed-da-god',   slug: 'shed-da-god',   name: 'Shed Da God',   category: 'Artist',            city: 'Atlanta',      cultureScore: 80,
    isRevealed: false, storyDebutDate: futureDate(7), teaserText: 'New chapter. New sound. Counting down.',
  }),
  story({ id: 'kj-scooter-son',slug: 'kj-scooter-son',name: 'KJ Scooter Son',category: 'Artist',            city: 'Atlanta',      cultureScore: 76,
    isRevealed: false, storyDebutDate: futureDate(14), teaserText: 'Coming up next on Direct2Culture.',
  }),
  story({ id: 'nin',           slug: 'nin',           name: 'Nin',           category: 'Producer',          city: 'Atlanta',      cultureScore: 79,
    isRevealed: false, storyDebutDate: futureDate(21), teaserText: 'Producer reveal incoming.',
  }),
];

function futureDate(daysFromNow) {
  const d = new Date(); d.setDate(d.getDate() + daysFromNow); return d.toISOString();
}

export function creatorBySlug(slug) {
  return creators.find((c) => c.slug === slug) || null;
}
