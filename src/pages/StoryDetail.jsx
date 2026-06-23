import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import StorySignupForm from '../components/story/StorySignupForm.jsx';
import { storyBySlug } from '../data/storyData.js';
import { submitTicketSignup, submitDropSignup } from '../lib/stories.js';
import { getBrandByTicker } from '../lib/brands.js';
import { trackCTA } from '../lib/tracking.js';
import { sendWebhook } from '../lib/webhooks.js';
import {
  notifyRichskaterSignup, notifyBarelysainSignup,
} from '../lib/notifications.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { trackStoryView, trackWaitlistJoin, userFromAuth } from '../lib/audience.js';

export default function StoryDetail() {
  const { slug } = useParams();
  const story = storyBySlug(slug);
  const [brand, setBrand] = useState(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!story?.ticker) return;
    let cancelled = false;
    (async () => {
      const b = await getBrandByTicker(story.ticker);
      if (!cancelled) setBrand(b);
    })();
    return () => { cancelled = true; };
  }, [story?.ticker]);

  // Identity Graph: log a storyViewed event when a logged-in fan opens this story.
  useEffect(() => {
    if (!story || !user) return;
    const audUser = userFromAuth(user, profile);
    if (!audUser) return;
    trackStoryView({
      user: audUser,
      storyId: story.slug,
      storyName: story.title || story.brand || story.slug,
    });
  }, [story?.slug, user?.uid]);

  if (!story) return <Navigate to="/stories" replace />;

  const isRichskater = slug === 'richskater';
  const isBarelysain = slug === 'barelysain';

  async function onSignup(form) {
    const payload = { ...form, story: slug, brand: story.brand, ticker: story.ticker };
    if (isRichskater) {
      await submitTicketSignup({ ...payload, kind: 'richskater_ticket' });
      notifyRichskaterSignup(payload).catch(() => {});
      sendWebhook('richskater_ticket_signup', payload).catch(() => {});
      trackCTA('richskater_ticket_signup', { email: payload.email });
    } else if (isBarelysain) {
      await submitDropSignup({ ...payload, kind: 'barelysain_drop' });
      notifyBarelysainSignup(payload).catch(() => {});
      sendWebhook('barelysain_drop_signup', payload).catch(() => {});
      trackCTA('barelysain_drop_signup', { email: payload.email });
    } else {
      await submitDropSignup({ ...payload, kind: 'generic_story' });
    }

    // Identity Graph: attribute the waitlist join to the logged-in fan, if any.
    const audUser = userFromAuth(user, profile);
    if (audUser) {
      trackWaitlistJoin({
        user: audUser,
        dropId: slug,
        dropName: story.brand || story.title || slug,
      }).catch(() => {});
    }
  }

  const signupId = isRichskater ? 'richskater-signup' : 'barelysain-signup';
  const signupHeading = isRichskater ? 'RichSkater Ticket Signup' : isBarelysain ? 'BarelySain Drop Signup' : 'Story Signup';
  const signupSubLabel = isRichskater
    ? 'Get priority access when the next RichSkater event drops.'
    : isBarelysain
    ? 'Be first to know when the next BarelySain chapter releases.'
    : 'Get story updates.';

  return (
    <>
      <SEO
        title={`${story.title} | Direct2Culture`}
        description={story.excerpt}
        type="article"
      />

      {/* Hero */}
      <div className="border-b border-ink/10">
        <div className="container-edge py-16 lg:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            {story.category} / {story.brand} · ${story.ticker}
          </p>
          <h1 className="mt-3 font-sans font-black tracking-tightest text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            {story.title}.
          </h1>
          <p className="mt-6 max-w-2xl text-ink/75 text-xl md:text-2xl leading-snug">
            {story.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {story.ctas.map((c) => (
              <CTAButton key={c.label} cta={c} />
            ))}
          </div>

          {/* Brand social / store links pulled from /admin/brands-market */}
          {brand && (
            <BrandLinks brand={brand} />
          )}
        </div>
      </div>

      {/* Quote */}
      {story.quote && (
        <div className="bg-ink text-bone">
          <div className="container-edge py-16 lg:py-24 max-w-3xl">
            <p className="font-sans text-3xl md:text-5xl font-black tracking-tight leading-tight">{story.quote}</p>
          </div>
        </div>
      )}

      {/* Gallery */}
      {story.gallery && story.gallery.length > 0 && (
        <section className="bg-bone">
          <div className="container-edge py-12 lg:py-16">
            <p className="eyebrow">Visual</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.gallery.map((g, i) => (
                <figure key={i} className="border border-ink/10 overflow-hidden bg-ink/5">
                  <img src={g.src} alt={g.alt || ''} className="w-full h-auto block" loading="lazy" />
                  {g.caption && (
                    <figcaption className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash border-t border-ink/10">
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body sections */}
      <article className="container-edge py-16 lg:py-24 max-w-3xl space-y-12">
        {story.bodySections.map((sec) => (
          <section key={sec.title}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{sec.title}</p>
            <p className="mt-3 text-lg md:text-xl text-ink/85 leading-relaxed">{sec.body}</p>
          </section>
        ))}
      </article>

      {/* Instagram feed (live, via brand record) */}
      {brand?.instagramFeedURL && (
        <section className="border-t border-ink/10 bg-bone">
          <div className="container-edge py-16 lg:py-20">
            <div className="flex items-end justify-between flex-wrap gap-4 border-b border-ink pb-3 mb-6">
              <div>
                <p className="eyebrow">Live Feed</p>
                <h2 className="mt-2 font-sans text-2xl font-black tracking-tight">@{brand.name} on Instagram</h2>
              </div>
              {brand.instagramURL && (
                <a href={brand.instagramURL} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
                  View on Instagram →
                </a>
              )}
            </div>
            <iframe
              src={brand.instagramFeedURL}
              className="w-full border border-ink/10"
              style={{ height: 500 }}
              scrolling="no"
              allowTransparency="true"
              allow="encrypted-media"
              title={`${brand.name} Instagram feed`}
            />
          </div>
        </section>
      )}

      {/* Signup form */}
      <section className="border-t border-ink/10 bg-ink/[0.03]">
        <div className="container-edge py-16 lg:py-20 max-w-3xl">
          <StorySignupForm
            id={signupId}
            heading={signupHeading}
            sublabel={signupSubLabel}
            onSubmit={onSignup}
            ctaLabel={isRichskater ? 'Join RichSkater →' : isBarelysain ? 'Join The Next Drop →' : 'Sign Up →'}
          />
        </div>
      </section>

      {/* Tell Your Story */}
      <section className="border-t border-ink/10 bg-ink text-bone">
        <div className="container-edge py-16 lg:py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-bone/50">Tell Your Story</p>
            <h2 className="mt-2 font-sans text-3xl md:text-5xl font-black tracking-tightest">Got a story like this?</h2>
          </div>
          <Link to="/tell-your-story" className="bg-bone text-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90">
            Tell Your Story →
          </Link>
        </div>
      </section>

      <div className="container-edge py-8">
        <Link to="/stories" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← All stories</Link>
      </div>
    </>
  );
}

function BrandLinks({ brand }) {
  const links = [
    { label: 'Store', url: brand.storeURL },
    { label: 'Instagram', url: brand.instagramURL },
    { label: 'TikTok', url: brand.tiktokURL },
    { label: 'Website', url: brand.websiteURL },
  ].filter((l) => l.url);
  const apps = [
    { label: 'Apple App Store', url: brand.iosAppURL },
    { label: 'Google Play', url: brand.androidAppURL },
  ].filter((l) => l.url);
  if (!links.length && !apps.length && !brand.ticker) return null;
  return (
    <div className="mt-6 pt-6 border-t border-ink/10 space-y-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
        ${brand.ticker} · {brand.name}
      </p>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA(`story_brand_link_${l.label.toLowerCase()}`, { ticker: brand.ticker })}
              className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            >
              {l.label} →
            </a>
          ))}
          <Link
            to={`/market/brand/${brand.ticker}`}
            className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
          >
            View on Market →
          </Link>
        </div>
      )}
      {apps.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Get the App</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {apps.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA(`story_app_${l.label.toLowerCase().replace(/\s+/g, '_')}`, { ticker: brand.ticker })}
                className="bg-ink text-bone px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
              >
                {l.label} ↓
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CTAButton({ cta }) {
  const onClick = () => trackCTA(`story_cta_${cta.label.toLowerCase().replace(/\s+/g, '_')}`);
  if (cta.kind === 'signup' && cta.link?.startsWith('#')) {
    return (
      <a href={cta.link} onClick={onClick} className="border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
        {cta.label} →
      </a>
    );
  }
  return (
    <Link to={cta.link} onClick={onClick} className="border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
      {cta.label} →
    </Link>
  );
}
