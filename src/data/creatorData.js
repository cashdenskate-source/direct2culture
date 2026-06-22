// 13 Direct2Culture creators. Stories are placeholder templates — edit per creator.
// Each creator gets a public page at /creator/:slug

export const CREATOR_CATEGORIES = [
  'Artist', 'Producer', 'DJ', 'Designer', 'Founder', 'Director', 'Skater', 'Creative Director',
];

const TEMPLATE_QUOTE = 'Culture starts before the algorithm catches it.';

function story({ id, slug, name, category, city, tagline, shortBio, fullStory, origin, work, worldbuilding, whyItMatters, whatsNext, instagram, website, cultureScore, status = 'featured' }) {
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
  };
}

export const creators = [
  story({ id: 'cee',           slug: 'cee',           name: 'Cee',           category: 'Founder',           city: 'Atlanta',      cultureScore: 88 }),
  story({ id: 'smith',         slug: 'smith',         name: 'Smith',         category: 'Designer',          city: 'Atlanta',      cultureScore: 84 }),
  story({ id: 'boy-floss',     slug: 'boy-floss',     name: 'Boy Floss',     category: 'Artist',            city: 'Atlanta',      cultureScore: 82 }),
  story({ id: 'vino',          slug: 'vino',          name: 'Vino',          category: 'Producer',          city: 'Atlanta',      cultureScore: 79 }),
  story({ id: 'calixte',       slug: 'calixte',       name: 'Calixte',       category: 'Director',          city: 'Atlanta',      cultureScore: 81 }),
  story({ id: 'slie-q',        slug: 'slie-q',        name: 'Slie Q',        category: 'Artist',            city: 'Atlanta',      cultureScore: 77 }),
  story({ id: 'stevie',        slug: 'stevie',        name: 'Stevie',        category: 'Creative Director', city: 'Atlanta',      cultureScore: 86 }),
  story({ id: 'dj-funky',      slug: 'dj-funky',      name: 'DJ Funky',      category: 'DJ',                city: 'Atlanta',      cultureScore: 85 }),
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
  }),
  story({ id: 'quay',          slug: 'quay',          name: 'Quay',          category: 'Skater',            city: 'Atlanta',      cultureScore: 78 }),
  story({ id: 'shed-da-god',   slug: 'shed-da-god',   name: 'Shed Da God',   category: 'Artist',            city: 'Atlanta',      cultureScore: 80 }),
  story({ id: 'kj-scooter-son',slug: 'kj-scooter-son',name: 'KJ Scooter Son',category: 'Artist',            city: 'Atlanta',      cultureScore: 76 }),
  story({ id: 'nin',           slug: 'nin',           name: 'Nin',           category: 'Producer',          city: 'Atlanta',      cultureScore: 79 }),
];

export function creatorBySlug(slug) {
  return creators.find((c) => c.slug === slug) || null;
}
