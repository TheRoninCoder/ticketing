import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>{label}</Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand" style={{ marginLeft: "15px" }}>
          IK Ticketing App
        </a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul
          className="nav d-flex align-items-center"
          style={{ marginRight: "15px" }}
        >
          {links}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
