# 2026-07-06 — design-system consumed via local tarball until first publish

## Decision

This app depends on `@you1anna/design-system` as a **packaged tarball**, not a
`file:../design-system` source link:

```
"@you1anna/design-system": "file:../design-system/you1anna-design-system-0.2.0.tgz"
```

After the first GitHub Packages publish of v0.2.0 (a Robin-gated outward action), the
dependency flips to registry semver — a one-line change:

```
"@you1anna/design-system": "^0.2.0"
```

Full context: `command-center/decisions/2026-07-06-design-system-packaging.md`.

## Rationale

- A `file:` source link nested a second React copy ("Invalid hook call"). A packed tarball
  carries no `node_modules`, so React resolves once and stays a peer dependency.
- The tarball is byte-for-byte what the registry would serve, so everything up to the
  publish is verifiable offline.

## Consequences

- Library changes require `npm run build && npm pack` in `../design-system`, then a
  reinstall here.
- `.npmrc` already maps the `@you1anna` scope to GitHub Packages (auth via
  `NODE_AUTH_TOKEN`), so the registry flip needs no other setup.
