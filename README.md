# π Visualiser

An interactive exploration of methods for calculating π, built with TypeScript and Vite.

**Live site:** https://YOUR-GITHUB-USERNAME.github.io/pi-visualiser/

---

## Methods implemented

| # | Method | Status |
|---|--------|--------|
| 01 | Monte Carlo | ✅ |
| 02 | Leibniz Series | ✅ |
| 03 | Buffon's Needle | 🚧 placeholder |

---

## Local development

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm

### First time setup

```bash
git clone https://github.com/YOUR-USERNAME/pi-visualiser.git
cd pi-visualiser
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open http://localhost:5173/pi-visualiser/ in your browser.

Hot-module replacement is enabled, so edits to `.ts` and `.css` files
reflect immediately in the browser.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. You can preview the production build with:

```bash
npm run preview
```

---

## Deploying to GitHub Pages

1. Push your code to the `main` branch of a GitHub repository named `pi-visualiser`.
2. In your repo: **Settings → Pages → Source → GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` will build and publish automatically.

> **Important:** if your repo is named something other than `pi-visualiser`, update
> the `base` field in `vite.config.ts` to match.

---

## Adding a new method

1. Create `src/methods/myMethod.ts` — export a `createMyMethodPage()` factory that returns `{ render, cleanup }`.
2. In `src/main.ts`, import and register it: `registerPage('my-method', createMyMethodPage)`.
3. In `index.html`, add a `<li>` entry to `#nav-list`.
4. In `src/methods/home.ts`, add a card to the `methods` array.

The router handles everything else via URL hashes.

---

## Project structure

```
pi-visualiser/
├── .github/workflows/deploy.yml   GitHub Actions deployment
├── src/
│   ├── main.ts                    Entry point — registers pages, starts router
│   ├── router.ts                  Hash-based client-side router
│   ├── style.css                  Global styles and design tokens
│   └── methods/
│       ├── home.ts                Introduction / method selection page
│       ├── monteCarlo.ts          Monte Carlo visualisation
│       ├── leibniz.ts             Leibniz series visualisation
│       └── buffon.ts              Buffon's Needle (placeholder)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```
