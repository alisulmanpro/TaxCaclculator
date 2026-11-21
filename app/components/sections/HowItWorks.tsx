const steps = [
  {
    title: "Each period is split at 30 June",
    text: "A period that runs past the year end is cut in two, so each part lands in the right fiscal year.",
  },
  {
    title: "Only the days you worked count",
    text: "If you started or left part-way through a month, that month is counted by its days.",
  },
  {
    title: "Each year is added up, then taxed",
    text: "Salary from every period in one fiscal year is added together and taxed once, with that year's rates.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section stack-14" style={{ gap: 28 }} aria-labelledby="how-title">
      <div className="stack-14" style={{ gap: 10 }}>
        <p className="eyebrow">How it works</p>
        <h2 className="section-title" id="how-title">
          How tax is worked out across several years
        </h2>
        <p className="section-lead" style={{ maxWidth: 620 }}>
          Pakistan taxes each fiscal year on its own, from 1 July to 30 June. Your salary history is cut into
          those years first.
        </p>
      </div>
      <div className="step-cards">
        {steps.map((step, i) => (
          <div className="step-card" key={step.title}>
            <span className="step-badge" aria-hidden="true">
              {i + 1}
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
