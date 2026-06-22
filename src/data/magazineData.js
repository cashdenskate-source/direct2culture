export const issues = [
  {
    id: 'issue-01',
    slug: 'issue-01',
    number: 1,
    title: 'Culture Before The Algorithm',
    season: 'Summer 2026',
    status: 'current', // current | upcoming | archive
    coverStory: 'Meet Neno: Building New Orleans Through Sound',
    coverStoryHref: '/creator/neno',
    coverImage: '',
    description: 'The first chapter of Direct2Culture as a print + digital quarterly. The artists, brands, DJs, and creators moving culture forward before the feeds catch up.',
    digitalHref: '/magazine/issue-01',
    printPrice: 18,
    digitalPrice: 0,
    tableOfContents: [
      { section: 'Cover Story', title: 'Meet Neno', creator: 'Neno', href: '/creator/neno' },
      { section: 'Music',       title: '$GENZ — The single of the summer', creator: 'Cashden', href: '/market/song/GENZ' },
      { section: 'Fashion',     title: 'BarelySain: drop by chapter', creator: 'BarelySain', href: '/stories/barelysain' },
      { section: 'DJs',         title: 'The DJ USB concept', creator: 'D2C', href: '/market/dj-usb' },
      { section: 'Creators',    title: '13 to watch — the next wave', creator: 'Direct2Culture', href: '/creators' },
      { section: 'Food',        title: 'Food of the Day', creator: 'Cashden', href: '/food' },
      { section: 'Events',      title: 'RichSkater x Direct2Culture', creator: 'RichSkater', href: '/events/richskater-direct2culture' },
      { section: 'Market Watch', title: 'The Culture Stock Exchange', creator: 'Editorial', href: '/market' },
      { section: 'AfterDrama',  title: 'How New Beauty Brands Break Into Retail', creator: 'AfterDrama', href: '/afterdrama' },
    ],
    featuredCreators: ['neno', 'cee', 'dj-funky', 'boy-floss'],
    featuredBrands: ['BSAIN', 'RSKTR', 'D2C'],
    featuredArtists: ['CSHDN'],
    featuredFood: 'cashden-chicken-biscuit',
    featuredCity: 'Atlanta',
  },
];

export const currentIssue = issues.find((i) => i.status === 'current') || issues[0];

export function issueBySlug(slug) {
  return issues.find((i) => i.slug === slug) || null;
}
