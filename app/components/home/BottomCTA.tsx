function ArrowIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function BottomCTA() {
  return (
    <section className="bottom-cta container">
      <div>
        <div className="eyebrow">YOUR NEXT STEP, WITH CONFIDENCE.</div>
        <h2>
          Some questions deserve
          <br />a personal conversation.
        </h2>
        <p>For the complexities a calculator can’t solve, we’re here.</p>
      </div>
      <a className="button button-green" href="mailto:consultation@thomasnorthman.com">
        Start a consultation <ArrowIcon />
      </a>
    </section>
  );
}
