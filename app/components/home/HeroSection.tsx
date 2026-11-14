import SalaryCalculator from "@/app/components/calculator/SalaryCalculator";

export default function HeroSection() {
  return (
    <section className="hero hero-centered container" id="about">
      <div className="hero-copy">
        <div className="eyebrow hero-anim hero-anim-1">
          <span className="green-line" /> CLARITY. CONFIDENCE. PEACE OF MIND.
        </div>
        <h1 className="hero-anim hero-anim-2">
          Pakistan Salary &amp; <span>Income Tax</span> Calculator
        </h1>
        <p className="hero-anim hero-anim-3">
          Understand your income. Know your taxes.
          <br className="desktop-break" /> Our income tax calculator brings clarity to the
          numbers—so you can plan your next step with confidence.
        </p>
      </div>
      <div
        className="calculator-section hero-anim hero-anim-4"
        id="calculator"
        role="region"
        aria-labelledby="calculator-title"
      >
        <h2 className="sr-only" id="calculator-title">
          Income tax calculator
        </h2>
        <SalaryCalculator />
      </div>
    </section>
  );
}
