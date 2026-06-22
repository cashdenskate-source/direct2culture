// Placeholder analytics tracking. Wire to GA / Meta Pixel / n8n later.

const ENABLED = false;

export function trackCTA(name, props = {}) {
  if (!ENABLED) {
    if (typeof console !== 'undefined') console.info('[track]', name, props);
    return;
  }
  // TODO: window.gtag?.('event', name, props);
  // TODO: window.fbq?.('trackCustom', name, props);
  // TODO: fetch('/api/track', { method: 'POST', body: JSON.stringify({ name, props }) });
}

export const KNOWN_CTAS = [
  'explore_culture_click',
  'submit_brand_click',
  'tell_your_story_click',
  'newsletter_join_click',
  'richskater_ticket_signup',
  'barelysain_drop_signup',
  'creator_profile_view',
  'open_market_click',
];
