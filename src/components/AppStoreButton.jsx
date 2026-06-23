import { trackCTA } from '../lib/tracking.js';

const ICONS = {
  apple: (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="currentColor" aria-hidden="true">
      <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.499 12.708l2.846 2.846-11.131 6.331 8.285-9.177zm0-1.416L6.215 2.115l11.13 6.331-2.846 2.846zM20.16 9.93l2.535 1.466a1 1 0 0 1 0 1.733l-2.534 1.466-3.061-3.061 3.06-2.604z" />
    </svg>
  ),
};

const LABELS = {
  apple: 'App Store',
  google: 'Google Play',
};

export default function AppStoreButton({ platform, url, trackingKey, trackingProps = {} }) {
  if (!url) return null;
  const icon = ICONS[platform];
  const label = LABELS[platform] || platform;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (trackingKey) trackCTA(trackingKey, { platform, ...trackingProps });
      }}
      className="inline-flex items-center gap-2 bg-ink text-bone px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
      aria-label={`Open ${label}`}
    >
      {icon}
      <span>{label}</span>
      <span aria-hidden="true">↓</span>
    </a>
  );
}
