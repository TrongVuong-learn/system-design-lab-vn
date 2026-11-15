# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

AGENTS.md (imported above) holds the binding repository rules. The notes below add what is needed to work in the code; they do not replace it.

## What this is

System Design Lab: a Vietnamese-language, mobile-first, interactive system-design course (static React SPA, no backend, no accounts). All UI copy and learning content is Vietnamese and written for high-school students; docs are Vietnamese too. Production deploys to Vercel automatically on merge to `master` — never deploy feature branches.

## Commands

Requires Node 24.x (`.node-version`, `engines` rejects other majors) and pnpm 11.25.0. Run everything from the repo root.

```sh
pnpm install --frozen-lockfile
pnpm dev              # content:build, then Vite dev server (127.0.0.1)
pnpm content:check    # validate content + coverage report is current (no output written)
pnpm content:build    # validate + write apps/web/src/generated/catalog.json
pnpm coverage:write   # regenerate docs/delivery/CONTENT_COVERAGE.md
pnpm typecheck
pnpm lint
pnpm format:check     # CI enforces this; `pnpm format` to fix
pnpm test:unit        # Vitest, node environment
pnpm build            # content:build + typecheck + vite build -> dist/ at repo root
pnpm test:e2e         # Playwright against `pnpm preview` on port 4173 (needs a fresh `pnpm build`)
```

Single tests:

```sh
pnpm vitest run packages/simulation-engine/src/routing.test.ts
pnpm vitest run -t "test name"
pnpm playwright test tests/e2e/routing.spec.ts --project=mobile-chromium
```

Playwright projects: `mobile-chromium`, `desktop-chromium`, `desktop-firefox`, `desktop-webkit`, plus `responsive-chromium`, which runs only `responsive-matrix.spec.ts`. First run needs `pnpm exec playwright install chromium firefox webkit`.

CI (`.github/workflows/quality.yml`) order: `pnpm audit --prod --audit-level=high` → `content:check` → `lint` → `format:check` → `test:unit` → `build` → `test:e2e`.

Gotchas:

- `apps/web/src/generated/` is git-ignored. `typecheck`, `lint` on a fresh checkout and the web app all need `pnpm content:build` to have run first (`dev` and `build` do it for you).
- E2E tests the built bundle, not the dev server. Rebuild after source or content changes; locally an already-running preview server is reused.
- Vitest only picks up `*.test.ts` under `packages/`, `apps/web/src/` and `tests/unit/`, in a node environment — there is no jsdom/React Testing Library setup. Component behaviour is covered by Playwright.
- `content:check` fails if `docs/delivery/CONTENT_COVERAGE.md` is stale; run `pnpm coverage:write` after changing lessons.

## Architecture

pnpm workspace: one app (`apps/web`, package `@sdl/web`) and three pure-TypeScript packages. `docs/engineering/ARCHITECTURE.md` is the source of truth, but its directory tree is partly a plan — `apps/api`, `apps/mobile`, `workers/`, `content/curriculum` etc. do not exist yet. Only create apps/packages when a milestone needs them.

Dependency direction (ESLint blocks `packages/**` from importing `react`, `react-dom`, `@capacitor/*` or anything in `apps/`):

```text
apps/web UI  → @sdl/learning-core     → @sdl/content-schema
apps/web UI  → @sdl/simulation-engine → @sdl/content-schema
scripts/     → @sdl/content-schema
apps/web/src/adapters → browser storage / service worker
```

- `packages/content-schema` — Zod schemas and validators for lessons, editorial registry, reviews, compatibility and pathways. The data boundary for content and saved data.
- `packages/simulation-engine` — one deterministic model per activity (`routing.ts`, `tls.ts`, `concurrency.ts`, …), each with a co-located test. No system time, no uncontrolled randomness, no DOM; state is derived from config/seed/command log, and checkpoints restored from storage or import are re-validated rather than trusted.
- `packages/learning-core` — learning model (progress, module practice, design drafts, games). Pure; storage lives in adapters.
- `apps/web/src` — `app/` (HashRouter shell, `ProgressProvider`, catalog loader), `features/` (`catalog`, `lesson-player`, `lab`, `games`, `review`, `progress`, `offline`), `adapters/` (IndexedDB progress and game repositories, offline pack), `ui/` (shared presentational pieces), `styles/` (Astryx base CSS plus app and mechanism-diagram CSS using Astryx tokens; components come from `@astryxdesign/core`, theme `lab` in `apps/web/themes/`).

Each lab in `features/lab/*Lab.tsx` is the renderer for an engine model of the same name; `Lab.tsx` dispatches on `lesson.kind`. Adding an activity means touching the schema whitelist, an engine model + test, a lab renderer, and lesson content together.

### Content pipeline

`scripts/content.ts` is the only path from source content to the UI:

1. Parses the 36 module rows out of `CURRICULUM_MAP.md` (regex on the `| L0.1 | … |` table — the count must be exactly 36, so edits to that table can break the build).
2. Loads every `content/lessons/vi/*.json` (each file is an array of lessons) and validates against `lessonSchema`.
3. Cross-checks against `content/editorial.json` (release status, sources per claim, prerequisites), `content/compatibility-v1.json` (published answer contract), `content/pathways.json` and `content/reviews/vi/*.json`.
4. Orders lessons by the hard-coded `order` list in the script — a new lesson must be added there — and writes `apps/web/src/generated/catalog.json`. Only lessons that pass editorial checks reach the UI.

Lessons are data only: activities reference a whitelisted registry, never arbitrary code/JSX/HTML. Content has stable IDs and versions; changing a mechanism, answer or learning outcome (as opposed to wording) needs a compatible version and an ADR in `docs/decisions/` when it alters a schema or data contract.

### Persistence and offline

- Progress is local-only in IndexedDB (database version 2, progress JSON version 1) via `adapters/progress-repository.ts`. Writes are compare-then-write in a readwrite transaction and raise `ProgressConflictError` on a cross-tab conflict; the UI does not merge snapshots. Keep old saved data readable — existing users have progress on their devices (see ADR 0002, 0005).
- Offline pack: the Vite `closeBundle` hook calls `scripts/offline.ts`, generating `dist/offline.json` and `dist/sw.js` from `scripts/offline-worker.template.js` with SHA-256 integrity per resource. It is opt-in from the Progress page and never touches progress data.
- `vercel.json` is the single source for security headers, including a strict CSP (`script-src 'self' 'wasm-unsafe-eval'`, `connect-src 'self' blob:`). `vite preview` applies the same headers, so E2E catches CSP regressions; inline scripts, external hosts and third-party fonts/CDNs will be blocked.

## Working conventions

- Unit tests sit next to the module (`*.test.ts`); E2E specs live in `tests/e2e/`. Simulation changes need a fixture or invariant test, not just a UI snapshot.
- Features do not import each other's internals; packages are consumed through their `src/index.ts` exports.
- Commit prefixes: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, with a scope (e.g. `feat(games): …`). PRs are squash-merged into `master`.
- Dependencies are pinned to a verified setup; do not upgrade frameworks as a side effect of an unrelated task.
- Each delivered task has a report in `docs/delivery/` (`EDU_*`, `QA_*`, `REL_*`); `docs/delivery/IMPLEMENTATION_STATUS.md` and `ROADMAP.md` record what is actually built versus planned. Update the primary doc when a decision changes rather than adding a conflicting one.
- UI work: read `DESIGN.md` and `docs/design/MOBILE_FIRST.md`; check 320/360/390/430 px widths as well as desktop.
