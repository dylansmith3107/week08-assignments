import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <h1>Bake It Easy</h1>
        <nav>
          <Link className="header-links" href={"/"}>
            Home
          </Link>
        </nav>
      </header>
    </>
  );
}
