export const cities = [
  { slug: 'los-angeles', name: 'Los Angeles', state: 'CA', country: 'USA' },
  { slug: 'atlanta', name: 'Atlanta', state: 'GA', country: 'USA' },
  { slug: 'miami', name: 'Miami', state: 'FL', country: 'USA' },
  { slug: 'new-york', name: 'New York', state: 'NY', country: 'USA' },
  { slug: 'london', name: 'London', state: '', country: 'UK' },
];

export function cityFromSlug(slug) {
  return cities.find((c) => c.slug === slug) || null;
}

export function normalizeCity(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/[,.]/g, '').trim();
}

export function isCityMatch(stored, city) {
  if (!stored || !city) return false;
  return normalizeCity(stored).includes(normalizeCity(city.name));
}
