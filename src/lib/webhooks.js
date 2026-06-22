// Placeholder n8n / Zapier / Make webhook dispatcher.
// Wire by replacing the WEBHOOK_URL constant + flipping ENABLED.

const ENABLED = false;
const WEBHOOK_URL = ''; // e.g. 'https://n8n.your-host.com/webhook/d2c-events'

const KNOWN_EVENTS = new Set([
  'new_signup',
  'new_submission',
  'new_paid_submission',
  'new_newsletter_signup',
  'new_contact_message',
  'approved_submission',
  'published_story',
  'new_dj_spin',
  'new_market_profile',
  // Storytelling engine
  'new_story_submission',
  'new_creator_submission',
  'new_video_submission',
  'richskater_ticket_signup',
  'barelysain_drop_signup',
  'creator_profile_view',
  'story_published',
]);

export async function sendWebhook(event, payload) {
  if (!KNOWN_EVENTS.has(event)) {
    console.warn('[webhooks] unknown event:', event);
  }
  if (!ENABLED || !WEBHOOK_URL) {
    if (typeof console !== 'undefined') {
      console.info('[webhooks stub]', event, payload);
    }
    return { ok: true, stub: true };
  }
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload, ts: Date.now() }),
    });
    return { ok: res.ok };
  } catch (e) {
    console.warn('[webhooks] dispatch failed', e);
    return { ok: false, error: e?.message };
  }
}
