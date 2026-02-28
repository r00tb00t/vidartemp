# CRACO / Plugin Dependency Investigation (frontend)

This note documents packages referenced by `craco.config.js` and local `plugins/**` code that are **not declared** in `package.json`, plus remediation options.

## Findings

### 1) `dotenv` (hard required)
- **Where**: `craco.config.js`
- **Code**: `require("dotenv").config();`
- **Usage**: Unconditional (executes on any `craco start/build/test`)
- **Status in package.json**: **NOT declared**
- **Failure mode**: `Error: Cannot find module 'dotenv'` when running CRACO.

### 2) `express` (dev-server only)
- **Where**: `plugins/visual-edits/dev-server-setup.js`
- **Code**: `const express = require("express");`
- **Usage**: Only when visual-edits are enabled. In `craco.config.js` this is enabled when `NODE_ENV !== "production"` (dev server).
- **Status in package.json**: **NOT declared**
- **Failure mode**: `Error: Cannot find module 'express'` during `craco start` if visual-edits are enabled.

### 3) `@babel/*` runtime packages used directly by the visual-edits tooling
- **Where**:
  - `plugins/visual-edits/babel-metadata-plugin.js`
    - `require("@babel/parser")`
    - `require("@babel/traverse").default`
    - (also in-file) generator/types are required in other functions
  - `plugins/visual-edits/dev-server-setup.js`
    - `require("@babel/parser")`, `@babel/traverse`, `@babel/generator`, `@babel/types`
- **Status in package.json**: **NOT declared** (only `@babel/plugin-proposal-private-property-in-object` is declared)
- **Failure mode**: `Cannot find module '@babel/parser'` etc during dev builds or when hitting `/edit-file` endpoint.

> Note: `react-scripts` may bring some Babel packages transitively, but relying on transitive deps is brittle and can break with lockfile changes.

### 4) Tailwind plugin
- **Where**: `tailwind.config.js` → `require("tailwindcss-animate")`
- **Status**: Declared (`tailwindcss-animate` in dependencies). OK.

## Remediation options (no changes applied)

### Option A (recommended): Declare direct dependencies explicitly
Add these to `devDependencies` (or dependencies if preferred):
- `dotenv`
- `express`
- `@babel/parser`
- `@babel/traverse`
- `@babel/generator`
- `@babel/types`

Pros:
- Most robust and least surprising.
- Matches direct `require(...)` usage.

Cons:
- Adds dev-time packages.

### Option B: Make `dotenv` optional
In `craco.config.js`, wrap loading in try/catch:
- `try { require("dotenv").config(); } catch (e) {}`
Pros:
- Avoids hard failure when dotenv isn't installed.

Cons:
- Can hide missing env-loading behavior.

### Option C: Make visual-edits optional if deps absent
Wrap `require("express")` and `require("@babel/*")` in try/catch inside the visual-edits modules and disable the feature when missing.

Pros:
- Dev-only tool becomes genuinely optional.

Cons:
- More code and can mask errors.

## Summary
Today the project **hard-requires `dotenv`** and (for dev server) **requires `express` and several `@babel/*` runtime packages** but does not declare them. Declaring these packages explicitly is the cleanest fix.
