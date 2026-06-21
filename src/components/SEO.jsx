import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description }) {
  const fullTitle = title || 'Direct2Culture | Culture Before The Algorithm';
  const desc =
    description ||
    'Direct2Culture documents the brands, creators, sounds, movements, and ideas shaping what comes next.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
