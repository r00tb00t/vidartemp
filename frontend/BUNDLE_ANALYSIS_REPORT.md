# Production bundle analysis (source-map-based)

This report summarizes a source-map-based production bundle analysis for `vidartemp-241505/frontend`.

## Build artifact
- JS (gzip): `build/static/js/main.582aaf81.js` — **101.73 kB gz**
- CSS (gzip): `build/static/css/main.7ef3a301.css` — **10.33 kB gz**

Source maps were generated and analyzed via `source-map-explorer`. The tool required `--no-border-checks` due to a sourcemap edge-case (“generated column Infinity…”).

## Largest contributors (by raw bytes)
Top items observed in the JS bundle:
1. `react-dom/cjs/react-dom-client.production.js` — 54,901 B
2. `react-router/dist/development/chunk-LFPYN7LY.mjs` — 14,755 B
3. App views:
   - `views/AmendmentConsole.js` — 4,870 B
   - `views/SystemExplorer.js` — 3,532 B
   - `views/EstateOverview.js` — 1,419 B
   - `views/GovernanceTraceView.js` — 1,287 B
4. `react/cjs/react.production.js` — 2,814 B
5. Axios internals (many files; ~21 KB raw total)

## Package-level contribution (summed raw bytes, approximate)
- react-dom: ~56,388 B
- axios: ~21,403 B
- react-router: ~14,755 B
- lucide-react: ~4,544 B
- react: ~3,119 B
- @babel/runtime: ~2,514 B
- scheduler: ~1,519 B

## Heavy deps / reduction suggestions (no changes made)
- **Axios** is the largest non-React dependency (~21 KB raw). If the app needs only basic HTTP JSON calls, consider using `fetch` to remove axios entirely.
- **React Router** is expected weight for routing (~15 KB raw). For future growth, keep route-level code splitting to avoid the main bundle expanding.

## Tree-shaking observations
- `lucide-react` appears to be properly tree-shaken (individual icon modules included; no full icon pack).

## “Unused” libraries (declared but not present in this bundle)
The following dependencies from `package.json` did not appear in the analyzed production bundle module list (0 modules matched in source-map-explorer output):
- `@radix-ui/*` packages
- `recharts`
- `zod`
- `react-hook-form` / `@hookform/resolvers`
- `date-fns`
- `cmdk`
- `embla-carousel-react`
- `sonner`
- `vaul`
- `next-themes`
- `react-resizable-panels`
- `input-otp`

Interpretation: they are either unused in the current build graph or only used behind code paths not reached by this build. They do not currently impact the shipped JS bundle size, but could still affect install size/build time/security surface.

## Notes / limitations
- Per-module gzip sizes were not present in the emitted JSON from this `source-map-explorer` run; contributor ranking above uses raw bytes. Bundle gzip sizes above come from CRA build output.
