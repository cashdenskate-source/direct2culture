// Food of the Day. Each pick = a creator's daily eat.
export const foodPicks = [
  {
    id: 'cashden-chicken-biscuit',
    slug: 'cashden-chicken-biscuit',
    creator: 'Cashden',
    creatorSlug: null, // not in creators list yet
    food: 'Chicken Biscuit',
    restaurant: 'Bird Pit',
    city: 'Los Angeles',
    story: 'Fuel before the build.',
    rating: 9.2,
    imagePlaceholder: '',
    date: new Date().toISOString(),
  },
  {
    id: 'neno-oxtails',
    slug: 'neno-oxtails',
    creator: 'Neno',
    creatorSlug: 'neno',
    food: 'Oxtails + Rice',
    restaurant: 'Aunt May\'s',
    city: 'New Orleans',
    story: 'Sunday studio fuel. The plate before the take.',
    rating: 9.6,
    imagePlaceholder: '',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'cee-shrimp-grits',
    slug: 'cee-shrimp-grits',
    creator: 'Cee',
    creatorSlug: 'cee',
    food: 'Shrimp & Grits',
    restaurant: 'Highland Bakery',
    city: 'Atlanta',
    story: 'Brunch with the team. The work conversation always follows.',
    rating: 8.9,
    imagePlaceholder: '',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const foodOfTheDay = foodPicks[0];

export function foodPicksByCreator(slug) {
  return foodPicks.filter((f) => f.creatorSlug === slug);
}

export function foodBySlug(slug) {
  return foodPicks.find((f) => f.slug === slug) || null;
}
