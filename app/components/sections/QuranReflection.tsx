export interface QuranReflectionProps {
  tagline?: string;
  arabic?: string;
  translation?: string;
  surah?: string;
  ayah?: string;
}

export default function QuranReflection({
  tagline,
  arabic = "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
  translation = "If you are grateful, I will surely increase you.",
  surah = "Surah Ibrahim",
  ayah = "14:7",
}: QuranReflectionProps = {}) {
  return (
    <section className="quran-reflection" aria-label="Quranic reflection">
      <div className="container">
        <div className="quran-card scroll-reveal">
          {tagline && (
            <div className="quran-tagline-wrap">
              <span className="quran-tagline">{tagline}</span>
            </div>
          )}
          <blockquote className="quran-quote">
            <p className="quran-arabic" dir="rtl" lang="ar">
              {arabic}
            </p>
            <p className="quran-translation">
              &ldquo;{translation}&rdquo;
            </p>
          </blockquote>

          <div className="quran-citation">
            <span className="quran-badge">
              <span>{surah}</span>
              <span className="quran-badge-dot" aria-hidden="true">
                &bull;
              </span>
              <span>{ayah}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
