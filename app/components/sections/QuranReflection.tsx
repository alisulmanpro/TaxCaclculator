export default function QuranReflection() {
  return (
    <section className="quran-reflection" aria-label="Quranic reflection">
      <div className="container">
        <div className="quran-card">
          <blockquote className="quran-quote">
            <p className="quran-arabic" dir="rtl" lang="ar">
              لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ
            </p>
            <p className="quran-translation">
              &ldquo;If you are grateful, I will surely increase you.&rdquo;
            </p>
          </blockquote>

          <div className="quran-citation">
            <span className="quran-badge">
              <span>Surah Ibrahim</span>
              <span className="quran-badge-dot" aria-hidden="true">
                &bull;
              </span>
              <span>14:7</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
