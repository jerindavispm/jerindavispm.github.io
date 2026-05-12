# jerindavispm.github.io

Personal portfolio for **Jerin Davis** — BCA student in Bangalore, interested in ERP systems and business process optimization.

Live: https://jerindavispm.github.io

## Stack

- Vite + React 19
- Tailwind CSS v4
- Motion (Framer Motion)
- Lenis (smooth scroll)
- Lucide icons
- Deployed to GitHub Pages via GitHub Actions

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

## Editing content

All copy lives in [`src/lib/data.js`](src/lib/data.js). Edit, commit, push — the workflow handles the rest.
