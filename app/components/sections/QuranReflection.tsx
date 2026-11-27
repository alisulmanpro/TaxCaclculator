import localFont from "next/font/local";

// Self-hosted (SIL Open Font License, app/fonts/LICENSE-Amiri.txt); downloaded only where it is used.
const amiri = localFont({
  src: "../../fonts/amiri-arabic-700-normal.woff2",
  weight: "700",
  variable: "--font-amiri",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

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
    <section className={`quran-reflection ${amiri.variable}`} aria-label="Quranic reflection">
      <div className="fx-wrap">
        <div className="quran-card scroll-reveal">
          {tagline && <p className="quran-tagline">{tagline}</p>}
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
