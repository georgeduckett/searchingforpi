# Searching for Pi

An interactive exploration of methods for calculating π, built with TypeScript and Vite.

---

## Methods implemented

| # | Method | Description |
|---|--------|-------------|
| 01 | Monte Carlo | Scatter random points inside a square and count how many land inside its inscribed circle |
| 02 | Leibniz Series | The alternating series 1 - 1/3 + 1/5 - 1/7 + … converges to π/4 |
| 03 | Buffon's Needle | Drop a needle at random onto a lined surface; the probability it crosses a line reveals π |
| 04 | Coin Toss Sequences | Toss coins until heads exceed tails; the ratio converges to π/4 |
| 05 | Bouncing Boxes | Two boxes with mass ratio 100^k collide elastically with a wall, encoding digits of π |
| 06 | Archimedes' Polygons | Squeeze π between inscribed and circumscribed regular polygons |
| 07 | Draw a Circle | Draw your own circle by clicking and dragging; circumference / diameter → π |

---

## Local development

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm

### First time setup

```bash
git clone https://github.com/YOUR-USERNAME/SearchingForPi.git
cd SearchingForPi
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open http://localhost:5173/ in your browser.

Hot-module replacement is enabled, so edits to `.ts` and `.css` files reflect immediately in the browser.

### Debug configuration

The VSCode launch configuration (`.vscode/launch.json`) automatically runs a TypeScript check before starting the dev server. If TypeScript errors are found, the debug session will not start, allowing you to catch type errors early.

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

1. Push your code to the `main` branch of a GitHub repository.
2. In your repo: **Settings → Pages → Source → GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` will build and publish automatically.

> **Note:** If your repo is named something other than `SearchingForPi`, update the `base` field in `vite.config.ts` to match.

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
SearchingForPi/
├── .github/workflows/deploy.yml   GitHub Actions deployment
├── src/
│   ├── main.ts                    Entry point — registers pages, starts router
│   ├── router.ts                  Hash-based client-side router
│   ├── style.css                  Global styles and design tokens
│   └── methods/
│       ├── home.ts                Introduction / method selection page
│       ├── monteCarlo.ts          Monte Carlo visualisation
│       ├── leibniz.ts             Leibniz series visualisation
│       ├── buffon.ts              Buffon's Needle visualisation
│       ├── coinToss.ts            Coin toss sequences visualisation
│       ├── bouncingBoxes.ts       Bouncing boxes visualisation
│       ├── archimedes.ts          Archimedes' polygons visualisation
│       └── drawCircle.ts          Draw circle visualisation
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```
