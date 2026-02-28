# Frontend Static Analysis Report (analysis-only)

This report was generated via analysis-only static review of `vidartemp-241505/frontend`.  
No code, dependencies, routing, or build system changes were made.

## Key Findings

### 1) Dead code
- No obvious orphan views: `EstateOverview`, `SystemExplorer`, `GovernanceTraceView`, `AmendmentConsole` are all routed from `src/App.js`.
- Conditional CRACO plugins under `plugins/visual-edits/*` and `plugins/health-check/*` may become effectively dead code if never enabled in any environment.

### 2) Unused imports
- ESLint could not be run because there is no ESLint config file at the project root (command fails with “ESLint couldn't find a configuration file”).
- Manual spot check indicates likely unused imports in `src/views/EstateOverview.js`:
  - `ShieldAlert`, `CheckCircle2`, `XCircle` appear imported but not used.

### 3) Unused dependencies (candidates)
Automated unused-dep detection could not be reliably captured as raw JSON output. Based on typical CRA patterns and spot checks:
- `cra-template` is a common candidate for removal after project creation (may be unused at runtime).
- `next-themes` is present but not observed in the key entry and view files reviewed; may be unused.

### 4) Missing dependencies (high confidence risk)
- `craco.config.js` calls `require("dotenv").config();` but `dotenv` is not listed in `package.json`.
- The visual-edits Babel plugin appears to require Babel internals; tooling reported missing:
  - `@babel/traverse`, `@babel/parser`, `@babel/generator`, `@babel/types`
  - These likely impact dev-only behavior when the visual edits feature is enabled.

### 5) Duplicate dependencies
- No duplicate keys in `package.json`.
- `npm ls` reports peer/version mismatches (not duplicates), most notably React 19 vs packages expecting React <=18 (e.g. `react-day-picker`).

### 6) Large bundle contributors
- A build artifact exists: `build/static/js/main.f07fdb3a.js`.
- Bundle breakdown could not be produced (likely missing sourcemaps). Likely large contributors given deps:
  - `recharts`
  - Radix UI component suite
  - `lucide-react`
  - `date-fns` (depends on import style)

### 7) React anti-patterns
- `GovernanceTraceView` disables exhaustive-deps lint for initial load effect; endpoint is stable so likely safe, but this pattern can hide dependency bugs.
- `AmendmentConsole` uses `// eslint-disable-line` on effect deps and calls a `useCallback` with external args; workable but brittle.
- Some lists use `key={i}` (index keys), which can cause reconciliation issues if items reorder.

### 8) Performance issues (obvious)
- Large lists (`systems`, `amendments`) are rendered without virtualization; may degrade with large datasets.
- Minor: Some helper components are defined inside render scope; generally OK but can create extra re-renders.

### 9) Unsafe environment variable usage (high severity)
- `src/api/client.js` reads `process.env.REACT_APP_INTERNAL_UI_SECRET` and sends it as `X-Internal-UI` header.
- Any `REACT_APP_*` variable is embedded into the public client bundle in CRA builds; it is **not a secret**.
- Provided container env var list does not include `REACT_APP_INTERNAL_UI_SECRET`, so header may be `undefined` at runtime.

### 10) Routing misconfiguration
- Routing in `src/App.js` is structurally sound: wildcard redirects to `/`.
- `BrowserRouter` requires server-side rewrite of SPA routes in production (otherwise refreshing deep links can 404).
- `Layout` uses `NavLink end` for all items; fine for non-nested routes.

## Commands attempted (analysis-only)
- `npx eslint ...` → failed: no ESLint config present.
- `npx depcheck --json` → output could not be captured in strict JSON form; it did report missing deps.
- `npx source-map-explorer build/static/js/*.js` → bundle file detected, no breakdown produced.
- `npm ls --json` → peer/version mismatch warnings surfaced (notably React 19 vs peers expecting <=18).
