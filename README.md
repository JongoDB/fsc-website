# Fighting Smart Cyber — Website

Static site for [fightingsmartcyber.com](https://fightingsmartcyber.com). Plain HTML/CSS/JS — no framework, no build step.

## Structure

```text
/
├── index.html            Homepage
├── about/  solutions/  training/  platforms/  bundles/  resources/
│                         Site pages (one .html per route)
├── assets/               Shared CSS (redesign.css) and JS (site.js, globe.js, scroll-frames.js)
├── _ds/                  FSC design-system token bundle (loaded before redesign.css)
├── public/               Images, favicons, and other static assets
├── api/submit.js         Vercel serverless function — contact / bundle-request /
│                         invoice-resend form submissions, emailed via Resend
└── vercel.json           Clean URLs, security headers, static deploy config
```

## Local development

Any static file server works. To match Vercel's clean-URL behavior (`/about/who-we-are` → `about/who-we-are.html`):

```sh
npx serve .
```

Form submissions require the serverless function, which `serve` doesn't run. To exercise forms locally use `vercel dev`, or test against production.

## Deployment

Pushes to `main` deploy to production via Vercel. `vercel.json` pins the project to a no-build static deploy; `api/` functions deploy automatically.

Required env var (already set in Vercel): `RESEND_API_KEY` — used by `api/submit.js` to email form submissions to team@fightingsmartcyber.com. Optional: `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
