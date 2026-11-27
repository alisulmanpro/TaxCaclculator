import type { ReactNode } from "react";

/** Heading block shared by the content sections of the calculator pages. */
export default function SectionHeader({
  eyebrow,
  icon,
  title,
  titleId,
  lead,
  children,
}: {
  eyebrow?: string;
  icon?: ReactNode;
  title: ReactNode;
  titleId: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="fx-head">
      {eyebrow && (
        <p className="fx-eyebrow">
          {icon}
          <span>{eyebrow}</span>
        </p>
      )}
      <h2 className="fx-title" id={titleId}>
        {title}
      </h2>
      {lead && <p className="fx-lead">{lead}</p>}
      {children}
    </header>
  );
}
