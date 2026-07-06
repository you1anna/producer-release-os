# Producer Release OS

A free, local-first planning tool for producers and DJs: release calendar, track pipeline,
studio reset checklist, and gig prep — built as the first real consumer of the
[`design-system`](../design-system) rails.

Everything stays in your browser (`localStorage`). No account, no backend, no tracking, no cost.

## Views

- **Releases** — month calendar with release dates toned by urgency (planned / soon / overdue) plus a sortable list.
- **Pipeline** — tracks move through `sketch → arrangement → mix → master → artwork → distributor → promo` with stage badges and progress.
- **Studio reset** — a practical reset checklist (seeded with 8 steps, add your own) with progress and one-tap reset.
- **Gig prep** — per-gig checklists seeded from a 7-item template (USB tested, backup, earplugs…).

Data actions: **Export JSON** (backup/share), **Import JSON**, **Print / PDF** (print styles strip chrome).

## Run

```bash
npm install        # also links ../design-system via file: dependency
npm run dev        # local dev server
npm run test       # vitest (jsdom)
npm run build      # typecheck + production bundle
npm run preview    # serve the production build
```

## Architecture notes

- Vite + React 18 + TypeScript SPA; **no auth, no backend, no payments** by design (v1 scope).
- All UI comes from `design-system` components and `--ds-*` tokens; app CSS only consumes tokens.
- State: one versioned `AppState` under the `producer-release-os/v1` localStorage key
  (`src/domain/types.ts`, `src/storage/store.ts`); corrupt/missing state falls back to a seed.
- The `file:` dependency means design-system changes require `npm run build` there, then
  reinstall/restart here.
- Test setup polyfills `localStorage` (Node ≥22's experimental webstorage global shadows jsdom's)
  and aliases React to a single copy (duplicate-React via the file: link).

## Status

Phase 2 of the Producer Release OS plan (see command-center
`docs/superpowers/plans/2026-07-05-producer-release-os-phase-2.md`). Hosting/public launch is a
separate, Robin-gated step.
