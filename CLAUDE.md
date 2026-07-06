# CLAUDE.md — producer-release-os

See `AGENTS.md` for the full agent contract. Quick orientation for Claude Code:

- **What this is:** a free, local-first planning SPA for producers/DJs (releases, pipeline,
  studio reset, gig prep) — the first real consumer of `@you1anna/design-system`.
- **Gate before commit:** `npm run lint && npm run test && npm run build`.
- **Tests** are colocated in `src/` (vitest + jsdom).
- **Design-system dep** is a local npm-pack tarball until the first GitHub Packages publish —
  see `decisions/2026-07-06-design-system-tarball-dependency.md`.
- **Scope guard:** localStorage-only; no backend, auth, or payments in v1.
- **Publishing/hosting/deploying** is outward-facing — Robin-gated, ask first.
- Hub-level context, plans, and cross-repo decisions live in the `command-center` repo
  (see `docs/README.md` here for pointers).
