export const eventConcepts = {
  'richskater-direct2culture': {
    slug: 'richskater-direct2culture',
    title: 'RichSkater x Direct2Culture',
    subtitle: 'Skate culture, music, and the next wave — one night.',
    excerpt: 'A live activation built around skating, sound, and the brands moving culture. Limited capacity. Direct invites first.',
    sections: [
      { title: 'Event Concept',     body: 'One night, two worlds. RichSkater + Direct2Culture turn a single venue into a moving exhibition — skate, sound, brand activations, live interviews, and the people building it all in the same room.' },
      { title: 'Skate Culture',     body: 'A live bowl session, footage drops, and a meet-and-greet with the RichSkater team. Underground first, mainstream second.' },
      { title: 'Music',             body: 'Curated by the D2C DJ Market. Live sets from artists on the Culture Stock Exchange. Cashden, Neno, and surprise drops.' },
      { title: 'Creators',          body: 'Creator-only rooms with the 13 D2C creators on the wall. Real interviews, recorded for the magazine.' },
      { title: 'Brand Activations', body: 'BarelySain, RichSkater, and D2C in-house all running pop-up moments. Try-ons, demos, takeaways.' },
      { title: 'Live Interviews',   body: 'On-the-floor interviews recorded for the Magazine + YouTube. Apply to be interviewed below.' },
      { title: 'DJ Sets',           body: 'Apply to spin via the DJ Market. Sets logged to your DJ profile. Spins = influence.' },
    ],
  },
};

export function eventConceptBySlug(slug) {
  return eventConcepts[slug] || null;
}
