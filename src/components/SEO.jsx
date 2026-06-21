import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://direct2culture.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export default function SEO({ title, description, image, type = 'website' }) {
  const location = useLocation();
  const fullTitle = title || 'Direct2Culture | Culture Before The Algorithm';
  const desc =
    description ||
    'The Culture Exchange tracking music, artists, DJs, brands, models, directors, editors, photographers, drops, events, and culture trends.';
  const canonical = `${SITE_URL}${location.pathname}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Direct2Culture" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
