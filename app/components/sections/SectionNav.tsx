/** "On this page" jump links shown under the calculator. */
export default function SectionNav({ links }: { links: { href: `#${string}`; label: string }[] }) {
  return (
    <nav className="fx-jump fx-wrap" aria-label="On this page">
      <p aria-hidden="true">On this page</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
