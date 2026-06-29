// Seed fitness entries. Hypebeast-style vertical mixing gear drops, scene
// reports, athlete/trainer profiles, and brand campaigns. Replace with
// Firestore-backed admin entries in Phase B.
const day = 24 * 60 * 60 * 1000;
const now = Date.now();

export const FITNESS_TYPES = ['drop', 'scene', 'profile', 'campaign'];

export const TYPE_LABELS = {
  drop: 'Drops',
  scene: 'Scenes',
  profile: 'Profiles',
  campaign: 'Campaigns',
};

export const fitness = [
  {
    id: 'ft-11',
    slug: 'satisfy-ss26-running-as-ritual',
    type: 'drop',
    title: 'Satisfy SS26 — Running As Ritual',
    brand: 'Satisfy',
    city: 'Paris',
    publishedAt: new Date(now - 1 * day).toISOString(),
    description:
      'Satisfy\'s SS26 collection treats the long run like a Sunday liturgy — French terry tees, packable Justice shorts, and a new colorway of the Salomon collab.',
    body:
      'Run gear has always pretended to be technical. Satisfy treats it as devotional. The SS26 collection — dropping in three waves through Q3 — leans further into the running-as-ritual thesis: weightless French terry, Justice shorts in unbleached cotton, and a second Salomon collab built on the X/Ultra platform.',
    externalURL: '#',
    accent: 'FT / 11',
  },
  {
    id: 'ft-10',
    slug: 'chinatown-runners-nyc',
    type: 'scene',
    title: 'Chinatown Runners — Mott Street, 6:30am',
    city: 'New York',
    publishedAt: new Date(now - 3 * day).toISOString(),
    description:
      'Inside the unofficial run club that meets at the Mott Street basketball courts before dawn and finishes at a soup dumpling counter that opens for them.',
    body:
      'They started as four friends recovering from a club night. Two years later it\'s a hundred people in a courtyard at 6:30am — every Sunday, rain or shine. No app. No coach. A WhatsApp pin and a 5K loop through TriBeCa, finishing at Joe\'s Shanghai before the line forms.',
    accent: 'FT / 10',
  },
  {
    id: 'ft-09',
    slug: 'mariko-yamamoto',
    type: 'profile',
    title: 'Mariko Yamamoto Is Building Tokyo\'s Quietest Run Club',
    athlete: 'Mariko Yamamoto',
    athleteSlug: 'mariko-yamamoto',
    city: 'Tokyo',
    publishedAt: new Date(now - 5 * day).toISOString(),
    description:
      'A former 1500m runner left her contract to start a 20-person run crew that meets in silence. No watches, no music, no posts. Just the Yamanote loop at midnight.',
    body:
      'Mariko ran the 1500m in college. She quit because the watch told her she was losing. The crew she started — Mute — runs the outer Yamanote loop at midnight, no electronics, no conversation. "Running used to be the silence I came to. The watch ate it."',
    accent: 'FT / 09',
  },
  {
    id: 'ft-08',
    slug: 'tracksmith-fells-fall',
    type: 'campaign',
    title: 'Tracksmith\'s Fells Campaign — Boston, In November',
    brand: 'Tracksmith',
    city: 'Boston',
    publishedAt: new Date(now - 7 * day).toISOString(),
    description:
      'Shot on 16mm in the Middlesex Fells over three weekends in November. A campaign about the season runners don\'t post about — the wet, the cold, the alone.',
    body:
      'Most run campaigns sell summer. Tracksmith sold November. Director Sam Pope shot the Fells campaign on 16mm over three damp weekends — no athletes, no copy, just the breath of strangers and the sound of a wet trail.',
    externalURL: '#',
    accent: 'FT / 08',
  },
  {
    id: 'ft-07',
    slug: 'bandit-marathon-kit-nyc',
    type: 'drop',
    title: 'Bandit\'s NYC Marathon Kit — Sold Out In 11 Minutes',
    brand: 'Bandit',
    city: 'New York',
    publishedAt: new Date(now - 9 * day).toISOString(),
    description:
      'The unsanctioned Marathon kit Bandit drops every November moved a thousand units in eleven minutes. No Boston-affiliated logos, no permission asked.',
    body:
      'Bandit doesn\'t pay USATF. They don\'t have to. The annual Marathon kit — singlet, half-zip, mesh cap — sold its full thousand-unit run in eleven minutes this year. Same as last. The waitlist is the marketing.',
    externalURL: '#',
    accent: 'FT / 07',
  },
  {
    id: 'ft-06',
    slug: 'bjj-sao-paulo-vovo',
    type: 'scene',
    title: 'The Vovô Lineage — São Paulo BJJ\'s Quietest Inheritance',
    city: 'São Paulo',
    publishedAt: new Date(now - 12 * day).toISOString(),
    description:
      'A 78-year-old Carlson Gracie black belt still teaches a 5am class in Vila Madalena. His students don\'t post. Most don\'t train anywhere else.',
    body:
      'The mat is older than most of the students. The instructor — known only as Vovô — is 78 and a Carlson Gracie black belt from 1981. The 5am class has never been promoted. New students come because someone\'s grandfather mentioned it.',
    accent: 'FT / 06',
  },
  {
    id: 'ft-05',
    slug: 'on-cloud-paris-takeover',
    type: 'campaign',
    title: 'On\'s Paris Takeover — Running Through The Arrondissements',
    brand: 'On',
    city: 'Paris',
    publishedAt: new Date(now - 15 * day).toISOString(),
    description:
      'On rented every billboard within a kilometer of Place de la République for forty-eight hours. The campaign: a single runner, twenty arrondissements.',
    body:
      'A forty-eight hour billboard takeover. One runner — French middle-distance prospect Élise Marchand — photographed in each of the twenty arrondissements at golden hour. The print buy alone is rumored at €1.4M.',
    externalURL: '#',
    accent: 'FT / 05',
  },
  {
    id: 'ft-04',
    slug: 'kojo-mensah-london',
    type: 'profile',
    title: 'Kojo Mensah Is Coaching London\'s Next Sprint Generation',
    athlete: 'Kojo Mensah',
    athleteSlug: 'kojo-mensah',
    city: 'London',
    publishedAt: new Date(now - 18 * day).toISOString(),
    description:
      'A former British 200m champion runs a Saturday-morning sprint clinic for South London teenagers out of a Crystal Palace track. Free, by application.',
    body:
      'Kojo Mensah held the British indoor 200m title in 2011. He coaches now — Saturday mornings, Crystal Palace, fifteen teenagers at a time. Application only. No website. A WhatsApp number passed between PE teachers.',
    accent: 'FT / 04',
  },
  {
    id: 'ft-03',
    slug: 'hoka-mafate-x-cecilie-bahnsen',
    type: 'drop',
    title: 'Hoka Mafate × Cecilie Bahnsen — Trail Meets Tulle',
    brand: 'Hoka',
    city: 'Copenhagen',
    publishedAt: new Date(now - 22 * day).toISOString(),
    description:
      'Hoka\'s Mafate Speed 4 in tulle-wrapped colorways, restocked through Cecilie Bahnsen\'s Copenhagen flagship.',
    body:
      'The third Hoka × Cecilie Bahnsen drop pulls the Mafate Speed 4 toward couture. Two colorways: an ivory tulle wrap and a bruised-plum suede. Restocked through Bahnsen\'s Bredgade flagship only.',
    externalURL: '#',
    accent: 'FT / 03',
  },
  {
    id: 'ft-02',
    slug: 'lagos-surf-fit-tarkwa',
    type: 'scene',
    title: 'Tarkwa Bay\'s Surf-Fit Generation',
    city: 'Lagos',
    publishedAt: new Date(now - 26 * day).toISOString(),
    description:
      'A water-fitness scene of paddle drills, sand sprints, and surf paddles is forming on Tarkwa Bay — half training camp, half youth movement.',
    body:
      'Tarkwa Bay sits a boat ride from Victoria Island and a world away from its gyms. The 6am cohort — eighteen swimmers, paddlers, and surfers between 14 and 22 — train in the shallows. The leader, Toba Ade, used to run a CrossFit box. "The water hits different. They listen."',
    accent: 'FT / 02',
  },
  {
    id: 'ft-01',
    slug: 'amara-okonkwo',
    type: 'profile',
    title: 'Amara Okonkwo Is Reinventing The Run Club Newsletter',
    athlete: 'Amara Okonkwo',
    athleteSlug: 'amara-okonkwo',
    city: 'Brooklyn',
    publishedAt: new Date(now - 30 * day).toISOString(),
    description:
      'A weekly Substack — "Slow Splits" — from a 32-year-old marathoner that reads more like literary criticism than training log. 14,000 subscribers and growing.',
    body:
      'Amara writes Slow Splits from a fourth-floor walk-up in Bed-Stuy. The newsletter is a weekly essay about a single run — usually slow, usually solo. "I\'m not writing about running. I\'m writing about being a person who happens to run."',
    accent: 'FT / 01',
  },
];

export function fitnessBySlug(slug) {
  return fitness.find((f) => f.slug === slug);
}
