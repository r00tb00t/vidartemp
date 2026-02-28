# Frontend (CRA + CRACO) - npm install/build verification

This frontend is a Create React App project customized via CRACO.

This repository is standardized on npm for dependency installation and build verification. Do not use yarn in CI or local verification workflows, because yarn may fail on Node 18 due to dependency `engines` constraints (for example, `react-router-dom@7` can declare `node >= 20`).

## Quick start (npm-first)

Run these commands from `vidartemp-241505/frontend`:

```bash
# Install exactly what's in package-lock.json
npm ci

# Dev server
npm start
```

## Build verification (CI-safe)

Use a non-interactive build command in CI:

```bash
npm ci
CI=true npm run build
```

This ensures a deterministic install from `package-lock.json` and avoids interactive prompts during the build.

## Environment variables

The container `.env` defines the following variables, which may be required for a fully functional runtime depending on which view you exercise:

- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_WS_URL`
- `REACT_APP_NODE_ENV`
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`

When running locally, ensure these are set via `.env` (or your shell) before `npm start` / `npm run build`.

## Available scripts

### `npm start`

Runs the app in development mode via CRACO. Open http://localhost:3000 to view it in your browser.

### `npm test`

Launches the test runner (CRACO wrapper around CRA test).

### `npm run build`

Builds the app for production to the `build` folder.

## Notes on package managers

This project includes a `package-lock.json` and uses `npm ci` for deterministic installs.

Avoid running `yarn install` or `yarn install --frozen-lockfile` for verification, because it can enforce stricter Node engine checks than npm and fail under Node 18.

## Learn more

You can learn more in the Create React App documentation: https://facebook.github.io/create-react-app/docs/getting-started
