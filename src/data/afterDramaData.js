export const afterDramaArticles = [
  {
    id: 'how-beauty-brands-break-retail',
    slug: 'how-beauty-brands-break-retail',
    title: 'How New Beauty Brands Break Into Retail',
    excerpt: 'Target. Sephora. Ulta. The unsexy work behind getting a new makeup brand onto a national shelf.',
    category: 'AfterDrama',
    publishedAt: new Date().toISOString(),
    body: [
      { title: 'The path everyone thinks works', body: 'You make a viral TikTok. A buyer slides into your DMs. You\'re on the shelf in 6 months. That happens. Once a year. To one brand.' },
      { title: 'The path that actually works', body: 'Build a wholesale-ready supply chain first, prove DTC velocity for 12-18 months, then approach buyers with data — not vibes.' },
      { title: 'The buyer\'s actual ask', body: 'A buyer at Sephora wants: proof you can ship 50k units in 8 weeks, brand authority on social, repeat purchase data, and a product that solves a problem their current lineup doesn\'t.' },
      { title: 'The contract reality', body: 'Net 60 terms. Chargebacks for damaged inventory. Markdown allowances. End-of-season pull-backs. Read every line.' },
      { title: 'Who actually gets in', body: 'Founders who treat retail as a distribution channel — not a finish line. The brands who win are the ones who keep building DTC + community after the retail deal hits.' },
    ],
    cta: { label: 'Read more on AfterDrama →', href: 'https://afterdrama.com' },
  },
];

export function afterDramaBySlug(slug) {
  return afterDramaArticles.find((a) => a.slug === slug) || null;
}
