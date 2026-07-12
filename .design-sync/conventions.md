# Fighting Smart Cyber (FSC) — design language

This design system ships **styles only — no importable components**. Build every screen from plain HTML elements (or your generic components) and apply FSC's CSS classes and tokens. The full stylesheet is `styles.css` → `_ds_bundle.css`; read it before styling — it is the source of truth for every rule named here.

## Setup

No provider or wrapper is required. The stylesheet styles bare elements globally (`body`, headings, `header`, `nav`, `footer`). The Inter font family (weights 400–900) loads via a Google Fonts `@import` already inside the stylesheet closure — do not add font links. Default theme is dark-on-light (`--text` on `--white`); dark bands are opt-in per section.

## Tokens (use `var(--*)` for any custom styling)

Colors: `--primary-blue` #0a2540 · `--secondary-blue` #1e4d7b · `--accent-blue` #0066cc · `--bright-blue` #00a8ff (primary CTA color) · `--cyan` #00d4ff · `--dark` #000 · `--dark-gray` #0d1117 · `--medium-gray` #161b22 · `--light-gray` #f6f8fa · `--white` · `--text` #24292f · `--text-light` #57606a · `--border` #d0d7de.

Signature gradient (heroes, dark bands): `linear-gradient(135deg, var(--dark) 0%, var(--dark-gray) 50%, var(--primary-blue) 100%)`.

## Class vocabulary (semantic classes — never invent utility classes)

- **Layout**: every section's content sits in `.container` (max-width 1400px, centered). Section shells: `.content-section-alt` (light-gray band), `.dark-section` (blue/dark gradient band, white text), `.cta-section`, `.bg-image-section`.
- **Section intro**: `.section-header` wrapping an `h2` and a `p` — centered, 48px bottom margin. Inside `.dark-section` it recolors automatically.
- **Hero**: `.hero` > `.hero-content` with `h1` (span `.highlight` for the cyan accent word) and `.hero-stat` blocks.
- **Buttons**: `.btn-primary` (bright-blue fill, dark text — the CTA) and `.btn-secondary` (outline style). Apply to `<a>` or `<button>`.
- **Cards**: `.cards-grid` (auto-fit grid, min 320px columns) containing `.mission-card` (frosted white, 20px radius; sub-parts `.mission-card-icon`, `.mission-card-btn`, `.mission-card-link`). Other real card variants: `.leadership-card`, `.course-card`, `.track-card` (in `.track-cards`), `.use-case-card`, `.feature-item`, `.trust-badge`.
- **Forms**: `.form-group` wraps label + input.
- **Motion (already defined — just add the class)**: `.scroll-animate`, `.scroll-animate-left`, `.scroll-animate-right`, `.stagger-children`, `.glow-on-hover`.

## Idiomatic section

```html
<section class="content-section-alt">
  <div class="container">
    <div class="section-header">
      <h2>Training That Sticks</h2>
      <p>Role-based cyber readiness for real operators.</p>
    </div>
    <div class="cards-grid">
      <div class="mission-card">
        <h3>Incident Response</h3>
        <p>Hands-on tabletop exercises for your whole team.</p>
        <a class="btn-primary" href="#">Start Training</a>
      </div>
    </div>
  </div>
</section>
```
