export const calculationSteps = [
  {
    step: "01",
    title: "Split Each Period at 30 June",
    text: "Pakistan's statutory tax year runs from 1 July to 30 June. If an employment period crosses 30 June, the calculator automatically divides it at the boundary so that income belonging to different fiscal years is taxed strictly under that year's separate tax schedule.",
  },
  {
    step: "02",
    title: "Count the Days Worked",
    text: "If you started a new job, resigned, or received an increment part-way through a month, the calculator counts the exact calendar days worked. It prorates your salary and monthly bonuses using exact daily fractions rather than flat monthly estimates.",
  },
  {
    step: "03",
    title: "Calculate Tax for Each Fiscal Year",
    text: "All salary periods and bonuses belonging to the same fiscal year are aggregated to determine your total annual taxable income. The progressive tax slabs, rates, and any applicable high-income surcharges for that specific fiscal year are then applied.",
  },
];

export default function CalculationMethodSection() {
  return (
    <section
      className="section-calc-method"
      id="calculation-method"
      aria-labelledby="calc-method-title"
    >
      <div className="calc-method-inner container">
        <header className="calc-method-header scroll-reveal">
          <div className="section-pill">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
            </svg>
            <span>CALCULATION METHOD</span>
          </div>

          <h2 className="section-title" id="calc-method-title">
            How salary tax is calculated across multiple fiscal years
          </h2>

          <p className="section-lead">
            Pakistan&apos;s tax year runs from 1 July to 30 June. When your salary changes or you
            start a new job, your income may fall across multiple fiscal years. Here&apos;s how the
            calculator handles these periods.
          </p>
        </header>

        <div className="calc-method-grid">
          {calculationSteps.map((item) => (
            <div className="calc-method-card scroll-reveal" key={item.step}>
              <div className="calc-method-card-top">
                <span className="calc-method-step" aria-label={`Step ${item.step}`}>
                  {item.step}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
