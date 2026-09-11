import Link from "next/link";

const LINKS = [
  { href: "/players", label: "Players" },
  { href: "/matchday", label: "Match Day" },
];

export default function NavBar() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Matchday Lineup
        </Link>
        <nav className="flex gap-6 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
