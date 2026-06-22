import { useState } from 'react';
import { mockGenerateSocial } from '../../lib/aiMock.js';
import { trackCTA } from '../../lib/tracking.js';

export default function SocialContentEngine({ creator }) {
  const [output, setOutput] = useState(null);
  const [tab, setTab] = useState('instagram');

  function generate() {
    setOutput(mockGenerateSocial({
      creatorName: creator.name,
      category: creator.category,
      city: creator.city,
      tagline: creator.tagline,
      work: creator.work,
    }));
    trackCTA('social_engine_generate', { slug: creator.slug });
  }

  function copy(text) {
    navigator.clipboard?.writeText(text);
    trackCTA('social_engine_copy');
  }

  return (
    <section className="border-y border-ink/10 bg-ink/[0.02]">
      <div className="container-edge py-12 lg:py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-ink pb-3">
          <div>
            <p className="eyebrow">Social Content Engine</p>
            <h2 className="mt-2 font-sans text-2xl font-black tracking-tight">Generate captions + copy.</h2>
            <p className="mt-2 text-ink/70 text-sm">Mock generator using the creator's data. Real AI coming soon.</p>
          </div>
          <button onClick={generate} className="btn-primary">
            {output ? 'Regenerate →' : 'Generate Content →'}
          </button>
        </div>

        {output && (
          <>
            <div className="mt-6 flex gap-2 flex-wrap">
              {[
                { k: 'instagram', label: 'Instagram' },
                { k: 'tiktok', label: 'TikTok' },
                { k: 'youtube', label: 'YouTube' },
                { k: 'newsletter', label: 'Newsletter' },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                    tab === t.k ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-6">
              {tab === 'instagram' && (
                <>
                  <Block label="Instagram Caption" text={output.instagramCaption} onCopy={copy} />
                  <Block label="Instagram Carousel" text={output.instagramCarousel.join('\n\n')} onCopy={copy} />
                  <Block label="Instagram Story" text={output.instagramStory} onCopy={copy} />
                </>
              )}
              {tab === 'tiktok' && (
                <Block label="TikTok Caption" text={output.tiktokCaption} onCopy={copy} />
              )}
              {tab === 'youtube' && (
                <>
                  <Block label="Shorts Title" text={output.youtubeShortsTitle} onCopy={copy} />
                  <Block label="Shorts Description" text={output.youtubeShortsDescription} onCopy={copy} />
                  <Block label="Longform Title" text={output.youtubeLongformTitle} onCopy={copy} />
                  <Block label="Longform Outline" text={output.youtubeLongformOutline.join('\n')} onCopy={copy} />
                </>
              )}
              {tab === 'newsletter' && (
                <Block label="Newsletter Blurb" text={output.newsletterBlurb} onCopy={copy} />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Block({ label, text, onCopy }) {
  return (
    <div className="border border-ink/10 p-4 bg-bone">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
        <button onClick={() => onCopy(text)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">
          Copy
        </button>
      </div>
      <pre className="mt-3 font-sans text-sm text-ink/85 whitespace-pre-wrap leading-relaxed">{text}</pre>
    </div>
  );
}
