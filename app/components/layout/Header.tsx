import { Logo } from "./Logo";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo />
        <NavLinks label="Main" />
      </div>
    </header>
  );
}
