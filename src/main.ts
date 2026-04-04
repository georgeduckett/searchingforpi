// ─── Application Entry Point ─────────────────────────────────────────────────
// This file bootstraps the application by initializing all modules.

import './style.css'
import { initRouter, registerPage } from './router'
import { pageFactories } from './methods/registry'
import { buildSidebarNav, initMobileNav, initTheme, initPageNav } from './navigation'

// ─── Register Pages ───────────────────────────────────────────────────────────
for (const [hash, factory] of Object.entries(pageFactories)) {
  registerPage(hash, factory)
}

// ─── Initialize Navigation ────────────────────────────────────────────────────
buildSidebarNav()
initMobileNav()
initPageNav()

// ─── Initialize Theme ─────────────────────────────────────────────────────────
initTheme()

// ─── Boot Router ──────────────────────────────────────────────────────────────
initRouter()
