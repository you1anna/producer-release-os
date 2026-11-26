# AGENTS.md — producer-release-os

Guidance for AI agents (Codex, Claude, Cursor, …) working in this repo.

## Read first

- `README.md` — what this is, how to run it, the design-system tarball dependency.
- This file.
- `decisions/` — durable choices; do not re-litigate.

Command-center was retired on 15 October 2026. Do not load it for guidance; this repo owns its
plans, status and decisions.

## Verify changes (the gate)

```bash
npm run lint    # oxlint
npm run test    # vitest (jsdom)
npm run build   # tsc -b && vite build
```

Tests are colocated in `src/` (e.g. `src/App.test.tsx`), not a separate `tests/` directory.

## Conventions that matter

- Vite + React 18 + TypeScript SPA. All UI comes from `@you1anna/design-system` components
  and `--ds-*` tokens; app CSS only consumes tokens.
- State is one versioned `AppState` under the `producer-release-os/v1` localStorage key
  (`src/domain/types.ts`, `src/storage/store.ts`).
- The design-system dependency is a local npm-pack tarball until the first GitHub Packages
  publish — see `decisions/2026-07-06-design-system-tarball-dependency.md`.

## Sensitive / generated

- `node_modules/` and `dist/` are generated — never commit them.

## Public repository

This repository is public. Each commit, commit message, branch and author address is published.

- Do not commit personal data or private intent, for example career, legal, health or money matters.
- Do not add host paths, machine names, network addresses, credentials, session URLs or names of
  private repositories.
- Use the GitHub noreply address as the commit author. Use synthetic data in examples and tests.
- If you are not sure that content is safe to publish, stop and ask Robin.

## Git workflow

- Solo personal repo. Commit directly to `main`; no PRs and no feature branches unless
  explicitly asked. If already on a branch, merge it back to `main` when the work is done.

## Don't change without asking

- **Do not add a backend, auth, or payments** — v1 is localStorage-only by design.
- **Do not publish, deploy, or host** the app — outward actions are Robin-gated.
