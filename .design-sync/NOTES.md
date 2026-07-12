# design-sync notes — fsc-website

- **Repo shape**: Astro website (no React). No components ship — this is a **tokens-only DS** sync: styles, tokens, and fonts only. The Claude Design project is "FSC Design System" (`76bdecdd-d185-4f4b-9e56-4b5ecfd361a6`), chosen by the user 2026-07-11 over porting the ~12 `.astro` components to React.
- **Stylesheet cascade order matters**: `main.css` → `modern.css` → `visuals.css` (modern.css deliberately overrides main.css). Matches the import order in `src/layouts/BaseLayout.astro`. `cfg.buildCmd` regenerates the concatenated `cssEntry` at `.design-sync/.cache/ds-styles.css` — always run it before the converter or the cssEntry is stale/missing (gitignored cache).
- **Entry stub**: `.design-sync/entry.mjs` (`export {}`) exists only to satisfy the converter's `--entry`; strict config validation rejects unknown keys (`projectName`, `scopeNote` were rejected — keep prose here, not in config.json).
- **Fonts**: Inter loads via a remote Google Fonts `@import` at the top of `main.css` (weights 400–900). No local font files in the repo — `[FONT_REMOTE]` is the expected, correct state.
- **Tokens**: 13 CSS custom properties, all in one `:root` block in `main.css` (`--primary-blue`, `--secondary-blue`, `--accent-blue`, `--bright-blue`, `--cyan`, `--dark`, `--dark-gray`, `--medium-gray`, `--light-gray`, `--white`, `--text`, `--text-light`, `--border`).

- **Converter deps live in `.ds-sync/` only** (gitignored — reinstall on fresh clone): `npm i esbuild ts-morph @types/react react react-dom playwright@1.60.0`. The repo itself has no React — the converter needs `react`/`react-dom` to vendor `_vendor/`, so pass `--node-modules ./.ds-sync/node_modules` (NOT `./node_modules`).
- **Playwright pin**: this machine's browser cache (`~/Library/Caches/ms-playwright/`) tops out at `chromium-1223`, which is playwright **1.60.0** — newer playwright pins 1228+ and fails `Executable doesn't exist`. Re-check the cache before bumping.

## Known render warns

- `[FONT_REMOTE] "Inter"` — expected; the site loads Inter from Google Fonts at runtime by design.

## First upload (2026-07-11)

- Uploaded 8 files (bundle js/css, styles.css, README with conventions header, `_vendor/react*.js`, sentinel, anchor) to project `76bdecdd-d185-4f4b-9e56-4b5ecfd361a6`; `package-validate.mjs` exited 0; post-upload `list_files` matched the bundle exactly.

## Re-sync risks

- The concatenated cssEntry is generated state — a re-sync that skips `cfg.buildCmd` builds from a stale or missing concat. When in doubt, re-run it (it's a no-op when sources are unchanged).
- If the site ever adds a fourth stylesheet or changes the import order in `BaseLayout.astro`, update `cfg.buildCmd` to match — nothing detects that drift automatically.
- If React/JSX components ever land in this repo, revisit the scope decision: the entry stub and tokens-only mode would silently hide them from the sync.
