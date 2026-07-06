# Producer Release OS

A free, local-first planning tool for producers and DJs: release calendar, track pipeline,
studio reset checklist, and gig prep — built as the first real consumer of the
[`@you1anna/design-system`](../design-system) rails.

Everything stays in your browser (`localStorage`). No account, no backend, no tracking, no cost.

## Views

- **Releases** — month calendar with release dates toned by urgency (planned / soon / overdue) plus a sortable list.
- **Pipeline** — tracks move through `sketch → arrangement → mix → master → artwork → distributor → promo` with stage badges and progress.
- **Studio reset** — a practical reset checklist (seeded with 8 steps, add your own) with progress and one-tap reset.
- **Gig prep** — per-gig checklists seeded from a 7-item template (USB tested, backup, earplugs…).

Data actions: **Export JSON** (backup/share), **Import JSON**, **Print / PDF** (print styles strip chrome).

## Run

```bash
npm install        # installs @you1anna/design-system (see dependency note below)
npm run dev        # local dev server
npm run test       # vitest (jsdom)
npm run build      # typecheck + production bundle
npm run preview    # serve the production build
```

### design-system dependency

This app consumes `@you1anna/design-system` as a **package**, not a `file:../design-system`
source link (the old link nested a second React copy → "Invalid hook call"). Until the library
is published to GitHub Packages, the dep is pinned to a locally-built tarball:

```
"@you1anna/design-system": "file:../design-system/you1anna-design-system-0.2.0.tgz"
```

Rebuild it in the library (`npm run build && npm pack` in `../design-system`) then reinstall
here if the library changes. **After the v0.2.0 registry publish** (Robin-gated), flip the dep to
the registry semver — a one-line change; `.npmrc` already maps the scope + `NODE_AUTH_TOKEN`:

```
"@you1anna/design-system": "^0.2.0"
```

## Architecture notes

- Vite + React 18 + TypeScript SPA; **no auth, no backend, no payments** by design (v1 scope).
- All UI comes from `@you1anna/design-system` components and `--ds-*` tokens; app CSS only consumes tokens.
- State: one versioned `AppState` under the `producer-release-os/v1` localStorage key
  (`src/domain/types.ts`, `src/storage/store.ts`); corrupt/missing state falls back to a seed.
- The design-system dep is a packaged tarball (see the dependency note above): library changes
  require `npm run build && npm pack` there, then reinstall here.
- Test setup polyfills `localStorage` (Node ≥22's experimental webstorage global shadows jsdom's).
  A single React copy is guaranteed by the package shipping react as a peer (no nested
  node_modules); Vite `resolve.dedupe` guards it.

## Status

Phase 2 of the Producer Release OS plan (see command-center
`docs/superpowers/plans/2026-07-05-producer-release-os-phase-2.md`). Hosting/public launch is a
separate, Robin-gated step.
