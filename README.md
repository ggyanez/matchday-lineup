# Matchday Lineup

**Live:** [matchday-lineup.vercel.app](https://matchday-lineup.vercel.app)

A small web app for amateur 11-a-side football teams that don't have a
settled starting eleven. Keep a roster of players with their primary and
secondary positions, mark who's confirmed for the next match, and get a
recommended formation and lineup built from the players you actually have
available.

## Why

Teams with irregular attendance rarely field the same lineup twice. Working
out a sensible formation by hand, every week, from whoever showed up, gets
old fast. This app automates that part: pick your confirmed players, and it
works out which formation and player assignment makes the best use of the
squad you have for that specific match.

## Features

- **Squad management** — add, edit, and remove players, each with a primary
  position and any number of secondary positions they can also cover.
- **Lineup recommendation** — given a set of confirmed players, evaluates
  several formations (4-4-2, 4-3-3, 3-4-3, 4-2-3-1, 3-5-2, 5-3-2, 4-5-1) and
  returns the one that best matches the squad, with a full player-to-slot
  assignment and bench.
- **Optional AI explanation** — when configured with an Anthropic API key,
  the app can ask Claude for a short, plain-language explanation of why the
  recommended lineup makes sense. This is a cosmetic layer only: the
  recommendation itself is always produced by a deterministic algorithm and
  the app works fully without an API key.

## How the recommendation works

Assigning players to a formation is treated as a weighted bipartite
matching problem: each formation slot (e.g. "right back") is matched against
each confirmed player, scored by how well that player fits the slot
(primary position, secondary position, same tactical line, or no natural
fit). The [Hungarian algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm)
then finds the assignment that maximizes the total fit across all 11 slots.
Every supported formation is scored this way and ranked, so the app can also
tell you the second- and third-best options.

This keeps the core recommendation fast, deterministic, and free to run —
no external calls are required to generate a lineup.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). By default the app
stores data in a gitignored `.data/players.json` file, so there's no setup
needed to try it out locally.

Copy `.env.local.example` to `.env.local` if you want to configure a
different data backend or enable AI explanations.

## Data storage

The data layer is abstracted behind a small `JsonDocumentStore` interface
with two implementations:

- **Local** (default): a JSON file under `.data/`, ignored by git. Meant for
  development only.
- **GitHub**: JSON files committed to a GitHub repository via the Contents
  API. Every write becomes a commit, which doubles as a free, permanent
  change history — and there's no database service that can pause or
  delete itself after a period of inactivity, which matters for an app
  that's typically only used once a week.

### Running with the GitHub backend

Keeping player data out of a public repository matters if you plan to open
source the app itself. The recommended setup uses **two repositories**:

1. This repository (public) — the application code.
2. A second repository (**private**) — just the data JSON files.

Set the following in your deployment environment (e.g. Vercel project
settings):

```
DATA_BACKEND=github
GITHUB_DATA_OWNER=<your-github-username-or-org>
GITHUB_DATA_REPO=<your-private-data-repo>
GITHUB_DATA_BRANCH=main
GITHUB_DATA_TOKEN=<fine-grained PAT, Contents: read & write, scoped to that repo only>
```

The token should be scoped to only the data repository, and stored as a
secret environment variable — never committed.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- No database server, no user accounts — the app is intentionally single-user
  and free to run

## Project structure

```
app/
  players/         Squad management page
  lineup/           Lineup generation page
  api/players/      Player CRUD endpoints
  api/lineup/        Lineup generation endpoint
lib/
  domain/           Core types: positions, formations, players
  lineup/            Matching algorithm (Hungarian algorithm + scoring)
  data/              Storage abstraction (local + GitHub backends)
  ai/                Optional Claude-generated lineup explanations
```

## License

MIT © Gabriel Yanez
