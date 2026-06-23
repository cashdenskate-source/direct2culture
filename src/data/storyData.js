// Long-form story landing pages. Format-driven so admin can add more later.

export const stories = [
  {
    id: 'richskater',
    slug: 'richskater',
    title: 'The RichSkater Story',
    subtitle: 'Skate culture, luxury, and the community building it.',
    category: 'Brand',
    brand: 'RichSkater',
    ticker: 'RSKTR',
    excerpt: 'RichSkater is what happens when skate culture stops asking permission. Started independent, building global. The next event drops soon.',
    heroImage: '',
    quote: '"We were never trying to fit in. We were always trying to build out."',
    bodySections: [
      {
        title: 'Origin',
        body: 'Before there was a brand, there was a board, a city, and a crew that refused to wait for permission. RichSkater started where every real brand starts — in the gaps the industry doesn\'t cover.',
      },
      {
        title: 'Skate Culture',
        body: 'Skate culture has always been ahead of mainstream — visually, sonically, structurally. RichSkater documents it from inside, not from a distance. The looks, the language, the lineage.',
      },
      {
        title: 'Luxury Meets Movement',
        body: 'The work is tailored, considered, never disposable. Pieces drop in capsules. Each chapter has a purpose. Luxury becomes a vehicle for the movement, not the other way around.',
      },
      {
        title: 'The Community',
        body: 'Riders, designers, photographers, DJs — RichSkater is a community first, a label second. The collective that moves the brand IS the brand.',
      },
      {
        title: 'The Next Event',
        body: 'Coming soon. Limited capacity. Ticket priority drops to the email list first.',
      },
      {
        title: 'The Future',
        body: 'A flagship, a film, a festival. Built city by city.',
      },
    ],
    ctas: [
      { label: 'Join RichSkater', kind: 'signup', link: '#richskater-signup' },
      { label: 'Get Ticket Updates', kind: 'signup', link: '#richskater-signup' },
      { label: 'Submit Skate Footage', kind: 'link', link: '/tell-your-story?ref=richskater' },
    ],
    gallery: [
      { src: '/stories/richskater/flyer-march-22.jpg', alt: 'RichSkater Gen Flyer · March 22', caption: 'Gen Flyer · March 22' },
      { src: '/stories/richskater/skate-comp-cover.jpg', alt: 'RichSkater Skate Comp Front Cover', caption: 'Skate Comp · Front Cover' },
    ],
  },
  {
    id: 'barelysain',
    slug: 'barelysain',
    title: 'The BarelySain Story',
    subtitle: 'A worldbuilding fashion label drop by drop.',
    category: 'Brand',
    brand: 'BarelySain',
    ticker: 'BSAIN',
    excerpt: 'BarelySain isn\'t a brand, it\'s a chapter system. Each drop is a chapter. Each chapter expands the world.',
    heroImage: '',
    quote: '"Each drop is a chapter. Read them in order if you want, or don\'t."',
    bodySections: [
      {
        title: 'Origin',
        body: 'Built from the inside — friends, sketches, late nights. The name became real before the strategy did.',
      },
      {
        title: 'Worldbuilding',
        body: 'BarelySain treats clothing the way novels treat plot. Each piece carries narrative — the fabric remembers where it came from.',
      },
      {
        title: 'The Chapter System',
        body: 'Drops are released as numbered chapters. Each chapter has a thesis, a palette, a story. Read in order or jump in anywhere.',
      },
      {
        title: 'The Drop',
        body: 'The next chapter is coming. Sign up to be first.',
      },
      {
        title: 'What Comes Next',
        body: 'A physical store, a chapter book, and an editorial side that runs alongside the label.',
      },
    ],
    ctas: [
      { label: 'Join The Next Drop', kind: 'signup', link: '#barelysain-signup' },
      { label: 'Get Drop Alerts', kind: 'signup', link: '#barelysain-signup' },
      { label: 'Submit For Styling', kind: 'link', link: '/tell-your-story?ref=barelysain' },
    ],
    gallery: [
      { src: '/stories/barelysain/653a1373.jpg', alt: 'BarelySain editorial', caption: 'Editorial' },
      { src: '/stories/barelysain/2024-05-08.jpg', alt: 'BarelySain campaign 2024-05', caption: 'Campaign · 05.08' },
    ],
  },
];

export function storyBySlug(slug) {
  return stories.find((s) => s.slug === slug) || null;
}

// "Featured Story" curation pointer — points to a creator slug for now (Meet Neno).
export const featuredStory = {
  type: 'creator',
  slug: 'neno',
  title: 'Meet Neno',
  subtitle: 'The story behind the sound, the work, and the movement.',
  ctaLabel: 'Read The Story',
  ctaLink: '/creator/neno',
};
