// Mock AI generation. Replace with Claude API or n8n webhook later.
//
// Future:
//   const res = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST', headers: { 'x-api-key': KEY, 'content-type': 'application/json' },
//     body: JSON.stringify({ model: 'claude-opus-4-7', messages: [...] }),
//   });

export function mockGenerateSocial(ctx) {
  const { creatorName, category, city, tagline, work } = ctx;
  const tag = (s) => `#${s.replace(/[^a-z0-9]/gi, '')}`.toLowerCase();
  const hashtags = [tag('direct2culture'), tag(creatorName), tag(category || 'culture'), tag(city || 'underground')].join(' ');

  return {
    instagramCaption:
      `Meet ${creatorName}.\n\n${tagline || ''}\n\n${work || ''}\n\nFull story on Direct2Culture →\n\n${hashtags}`,
    instagramCarousel: [
      `Slide 1 — Meet ${creatorName}`,
      `Slide 2 — ${tagline || 'The work speaks for itself.'}`,
      `Slide 3 — ${work || 'Look closer.'}`,
      `Slide 4 — Read the full story on Direct2Culture`,
    ],
    instagramStory:
      `${creatorName} on D2C →\nSwipe up. ${hashtags}`,
    tiktokCaption:
      `${creatorName} — the next chapter is on @direct2culture. ${hashtags}`,
    youtubeShortsTitle:
      `${creatorName} on Direct2Culture #shorts`,
    youtubeShortsDescription:
      `Meet ${creatorName} — ${category} from ${city}. Full story on Direct2Culture. ${hashtags}`,
    youtubeLongformTitle:
      `Meet ${creatorName} — Inside the world they're building`,
    youtubeLongformOutline: [
      `0:00 — Cold open`,
      `0:30 — Who is ${creatorName}`,
      `1:30 — Origin: ${city}`,
      `3:00 — The Work`,
      `5:30 — The World They're Building`,
      `8:00 — Why It Matters`,
      `9:30 — What's Next`,
      `11:00 — CTA + outro`,
    ],
    newsletterBlurb:
      `New story on Direct2Culture: Meet ${creatorName}. ${tagline || ''} Read now →`,
  };
}

export function mockGenerateArticle(ctx) {
  const { title, creatorName, category, city, context, keyFacts, tone, links } = ctx;
  const slug = (title || creatorName || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
  const bullets = (keyFacts || '').split('\n').filter(Boolean).map((l) => `• ${l.trim()}`).join('\n');
  return {
    article:
      `## ${title || `Meet ${creatorName}`}\n\n` +
      `${context || `${creatorName} is a ${category || 'creator'} based in ${city || 'somewhere'}.`}\n\n` +
      `### The Work\n${bullets || '• Notable releases\n• Standout collaborations\n• What they\'re building now'}\n\n` +
      `### What's Next\nThe next chapter is in motion. Direct2Culture will be there.`,
    intro:
      `${creatorName || 'They'} aren't waiting for permission. ${context?.split('.')[0] || 'This is the story.'}.`,
    pullQuote:
      `"${tone === 'raw' ? 'I just do the work and let it land.' : 'Culture starts before the algorithm catches it.'}"`,
    instagramCaption: `Meet ${creatorName}.\n\nNew story on Direct2Culture →\n\n#direct2culture #${(category || 'culture').toLowerCase()}`,
    tiktokCaption: `${creatorName} on Direct2Culture. Tap in.`,
    youtubeTitle: `${title || `Meet ${creatorName}`} | Direct2Culture`,
    youtubeDescription:
      `${context || ''}\n\nRead the full story on Direct2Culture.${links ? `\n\nLinks:\n${links}` : ''}`,
    newsletterBlurb: `Out now: ${title || `Meet ${creatorName}`}. Read on Direct2Culture →`,
    seoTitle: `${title || `Meet ${creatorName}`} | Direct2Culture`,
    seoDescription:
      `${context?.slice(0, 150) || `${creatorName} — ${category || 'creator'} based in ${city || 'somewhere'}.`}`,
    slug,
    tags: [
      (category || 'culture').toLowerCase(),
      (city || 'underground').toLowerCase().replace(/\s+/g, '-'),
      'direct2culture',
    ],
  };
}
