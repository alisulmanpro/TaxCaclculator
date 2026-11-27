import type { ReactNode } from "react";

/** Heading block of the two table sections. Each line rises into view on its own. */
export default function DataSectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  lead: ReactNode;
}) {
  return (
    <div className="fx-data-head">
      <p className="fx-data-eyebrow fx-rise">{eyebrow}</p>
      <h2 className="fx-data-title fx-rise" id={titleId}>
        {title}
      </h2>
      <p className="fx-data-lead fx-rise">{lead}</p>
    </div>
  );
}
