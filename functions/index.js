import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret, defineString } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = defineString('ADMIN_EMAIL', { default: 'cashdenskate@gmail.com' });
const SMTP_USER = defineString('SMTP_USER');
const SMTP_PASS = defineSecret('SMTP_PASS');

export const onNewSignup = onDocumentCreated(
  {
    document: 'users/{uid}',
    region: 'us-central1',
    secrets: [SMTP_PASS],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const to = ADMIN_EMAIL.value();
    const smtpUser = SMTP_USER.value();
    const smtpPass = SMTP_PASS.value();

    if (!smtpUser || !smtpPass) {
      logger.warn('SMTP creds missing — skipping email. Set SMTP_USER and SMTP_PASS.');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `Direct2Culture <${smtpUser}>`,
      to,
      subject: `New sign-up: ${data.name || data.email}`,
      text: [
        `Name:  ${data.name || '(none)'}`,
        `Email: ${data.email}`,
        `Role:  ${data.role}`,
        `UID:   ${event.params.uid}`,
        '',
        'View all sign-ups: https://direct2culture.com/admin/users',
      ].join('\n'),
    });

    logger.info(`Signup email sent for ${data.email}`);
  },
);
