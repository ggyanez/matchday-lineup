import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Matchday Lineup</h1>
      <p className="mt-4 max-w-2xl text-black/70 dark:text-white/70">
        Keep track of your squad&apos;s positions, mark who&apos;s confirmed for the next
        match, and get a recommended starting eleven built from the players you actually
        have available — no more guessing the lineup an hour before kickoff.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/players"
          className="rounded-lg border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
        >
          <h2 className="font-medium">Manage Players</h2>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Add, edit, and remove players, along with their primary and secondary
            positions.
          </p>
        </Link>

        <Link
          href="/matchday"
          className="rounded-lg border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
        >
          <h2 className="font-medium">Build a Match Day</h2>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Select who&apos;s confirmed and get the best-fitting formation and lineup for
            this squad.
          </p>
        </Link>
      </div>
    </div>
  );
}
