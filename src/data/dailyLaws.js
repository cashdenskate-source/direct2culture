// Daily Laws of Culture — seed set.
// 30 entries cycle by day-of-year until the full 366-entry calendar is curated
// (Phase B: admin-editable via Firestore).
// Each law is short enough to fit on a single homepage line; the body is the
// "why" you read on the /today page.

export const dailyLaws = [
  {
    law: 'Culture moves before the algorithm sees it.',
    body: 'By the time a trend trends, it has already left the room it was born in. Be in the room.',
  },
  {
    law: 'Identify the audience. Don\'t count the clicks.',
    body: 'A number is forgettable. A name shows up to the next thing.',
  },
  {
    law: 'Distribution is rented. Identity is owned.',
    body: 'Spotify, TikTok, Instagram — none of them are yours. The relationship with the person on the other end is the only thing you keep.',
  },
  {
    law: 'The brand that doesn\'t ask permission sets the precedent.',
    body: 'Permission-based marketing is permission-based culture. The work that lasts didn\'t wait for approval.',
  },
  {
    law: 'A scene survives on its own language. Steal it and you become a tourist.',
    body: 'Borrow it earned, not borrowed cheap. The audience knows the difference within one sentence.',
  },
  {
    law: 'If you can be replaced by a trend, you were a trend.',
    body: 'Style is what survives the cycle. Trends are what fill the time between styles.',
  },
  {
    law: 'Streaming gave you scale. Identity gives you a relationship.',
    body: '10 million strangers is loneliness. 1,000 known fans is a movement.',
  },
  {
    law: 'Make the work the people who know you would die for.',
    body: 'The rest of the audience comes through proximity to that intensity, not through compromise to it.',
  },
  {
    law: 'The future of culture is who shows up, not who scrolls past.',
    body: 'Showing up is the highest-cost engagement. Anyone who pays it is worth knowing by name.',
  },
  {
    law: 'A creator who knows their audience doesn\'t need a manager.',
    body: 'The middle layer existed because the artist couldn\'t see the listener. Once they can, the middle disappears.',
  },
  {
    law: 'Aesthetic is a filter, not a strategy.',
    body: 'The look gets you noticed. The work keeps people. Don\'t confuse the two.',
  },
  {
    law: 'The first 100 fans are the only ones who matter for the next 10,000.',
    body: 'Build for them. They are the carriers.',
  },
  {
    law: 'A platform is only as honest as the contact info it gives you.',
    body: 'If you can\'t reach your people, you don\'t have a community. You have rented attention.',
  },
  {
    law: 'Don\'t document the trend. Document the people building inside it.',
    body: 'The trend will rot. The people you covered will outlive it and remember who saw them first.',
  },
  {
    law: 'Underground is a posture; the work is what makes it real.',
    body: 'Anyone can dress in opposition. Few can sustain it long enough to become unavoidable.',
  },
  {
    law: 'Speed is overrated. Specificity wins.',
    body: 'Being first to a noisy idea is forgettable. Being precise to a small one is permanent.',
  },
  {
    law: 'Every viral moment was a private moment first.',
    body: 'Cover the private rooms. The public ones cover themselves.',
  },
  {
    law: 'A drop without a list is a wish.',
    body: 'If you don\'t know who to text when it launches, you launched at no one.',
  },
  {
    law: 'The fan is the publication.',
    body: 'They share with a credibility no brand owns. Earn it; never demand it.',
  },
  {
    law: 'Independence is not isolation.',
    body: 'Stay outside the system; stay inside the conversation.',
  },
  {
    law: 'Don\'t build for the feed. Build for the bookmark.',
    body: 'The feed forgets in 24 hours. The bookmark is forever.',
  },
  {
    law: 'A creator without a city is a creator without weather.',
    body: 'Be from somewhere specific. It\'s the only thing the internet can\'t flatten.',
  },
  {
    law: 'The interview matters more than the press release.',
    body: 'A press release is a brand asking to be repeated. An interview is a person being remembered.',
  },
  {
    law: 'Loyal small beats viral large, every quarter.',
    body: 'The math always favors retention. Always.',
  },
  {
    law: 'If the work needs an explanation, it needs another draft.',
    body: 'The audience\'s patience is the budget. Don\'t spend it on context.',
  },
  {
    law: 'Be the source, not the syndication.',
    body: 'Everyone reposts. Few are reposted.',
  },
  {
    law: 'The next big brand was on a flyer two years ago.',
    body: 'Pay attention to the flyer.',
  },
  {
    law: 'Followers are leased. Subscribers are bought. Members are kept.',
    body: 'Each tier is a deeper commitment from both sides. Aim for the deepest one you can earn.',
  },
  {
    law: 'A culture that can\'t introduce its people to each other is just an audience.',
    body: 'Communities have edges and entry points. Audiences have neither.',
  },
  {
    law: 'You are not late.',
    body: 'The thing being built today will look obvious in two years. Build it anyway.',
  },
];

// Pick today's law deterministically from the calendar day.
export function todaysLaw(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = (dayOfYear - 1 + dailyLaws.length) % dailyLaws.length;
  return { ...dailyLaws[index], dayOfYear, index };
}
