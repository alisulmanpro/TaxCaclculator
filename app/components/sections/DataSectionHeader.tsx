import type { ReactNode } from "react";

/** Heading block of the two table sections. Each line rises into view on its own. */
export default function DataSectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  eyebrowInTitle = false,
}: {
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  lead: ReactNode;
  /** Makes the small line part of the H2, when it carries the words people search for. */
  eyebrowInTitle?: boolean;
}) {
  return (
    <div className="fx-data-head">
      {eyebrowInTitle ? (
        <h2 className="fx-data-heading" id={titleId}>
          <span className="fx-data-eyebrow fx-rise">{eyebrow}</span>{" "}
          <span className="fx-data-title fx-rise">{title}</span>
        </h2>
      ) : (
        <>
          <p className="fx-data-eyebrow fx-rise">{eyebrow}</p>
          <h2 className="fx-data-title fx-rise" id={titleId}>
            {title}
          </h2>
        </>
      )}
      <p className="fx-data-lead fx-rise">{lead}</p>
    </div>
  );
}
