// Placeholder notification service.
// Wire to Resend / SendGrid / Postmark later by replacing send().
// Each function returns a Promise so callers can await without changes when real provider is added.

const ENABLED = false; // flip when a provider is wired up

async function send({ to, subject, body, tag }) {
  if (!ENABLED) {
    if (typeof console !== 'undefined') {
      console.info('[notifications stub]', { to, subject, tag, bodyPreview: body?.slice(0, 80) });
    }
    return { ok: true, stub: true };
  }
  // TODO: replace with:
  //   await fetch('https://api.resend.com/emails', { method: 'POST', headers: {...}, body: JSON.stringify(...) })
  return { ok: true };
}

const ADMIN_EMAIL = 'cashdenskate@gmail.com';

export const notifyNewSignup = (user) =>
  send({
    to: ADMIN_EMAIL,
    subject: `New sign-up: ${user.name || user.email}`,
    body: `${user.name || '(no name)'} (${user.email}) joined as ${user.userType || 'fan'}.`,
    tag: 'new_signup',
  });

export const notifyNewSubmission = (sub) =>
  send({
    to: ADMIN_EMAIL,
    subject: `New submission: ${sub.brand || sub.title || sub.type}`,
    body: JSON.stringify(sub, null, 2),
    tag: 'new_submission',
  });

export const notifyNewsletterSignup = (entry) =>
  send({
    to: ADMIN_EMAIL,
    subject: `Newsletter signup: ${entry.email}`,
    body: `${entry.name || '(no name)'} (${entry.email}) wants: ${(entry.interests || []).join(', ') || 'all'}`,
    tag: 'newsletter_signup',
  });

export const notifyContactMessage = (msg) =>
  send({
    to: ADMIN_EMAIL,
    subject: `Contact: ${msg.subject}`,
    body: `From ${msg.name} <${msg.email}>:\n\n${msg.message}`,
    tag: 'contact_message',
  });

export const notifyFeaturedPurchase = (purchase) =>
  send({
    to: ADMIN_EMAIL,
    subject: `Featured purchase: ${purchase.tier}`,
    body: `${purchase.buyer} bought ${purchase.tier} for $${purchase.amount}.`,
    tag: 'featured_purchase',
  });

export const notifySubmissionApproved = (sub, user) =>
  send({
    to: user.email,
    subject: 'Your Direct2Culture submission was approved',
    body: `Your submission "${sub.brand || sub.title}" was approved. Watch your inbox for next steps.`,
    tag: 'submission_approved',
  });

export const notifySubmissionRejected = (sub, user) =>
  send({
    to: user.email,
    subject: 'Direct2Culture submission update',
    body: `We reviewed "${sub.brand || sub.title}" and won't be featuring it this round. Thanks for putting us on.`,
    tag: 'submission_rejected',
  });

export const notifySubmissionNeedsEdits = (sub, user, notes) =>
  send({
    to: user.email,
    subject: 'Edits requested on your Direct2Culture submission',
    body: `Editorial flagged your submission "${sub.brand || sub.title}" for revisions:\n\n${notes || '(no notes)'}\n\nLog in to /dashboard/submissions to update.`,
    tag: 'submission_needs_edits',
  });
