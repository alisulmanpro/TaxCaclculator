import MultiYearCalculator from "@/app/components/calculator/MultiYearCalculator";

export default function MultiYearHeroSection() {
  return (
    <section className="hero hero-centered container" id="about">
      <div className="hero-copy">
        <div className="eyebrow hero-anim hero-anim-1">
          <span className="green-line" /> CLARITY. CONFIDENCE. PEACE OF MIND.
        </div>
        <h1 className="hero-anim hero-anim-2">
          Pakistan Multi-Year <span>Income Tax</span> Calculator
        </h1>
        <p className="hero-anim hero-anim-3">
          Track tax liability across changing salaries, promotions, and fiscal years.
          <br className="desktop-break" /> See your complete salary history, statutory allocations,
          and net take-home in one place.
        </p>
      </div>
      <div
        className="calculator-section hero-anim hero-anim-4"
        id="calculator"
        role="region"
        aria-labelledby="calculator-title"
      >
        <h2 className="sr-only" id="calculator-title">
          Multi-year income tax calculator
        </h2>
        <MultiYearCalculator />
      </div>
    </section>
  );
}
