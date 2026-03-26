import type { Page } from '../router'
import { methodPages } from '../pages'

// ─── Page ───────────────────────────────────────────────────────────────────
export function createHomePage(): Page {
  function render(): HTMLElement {
    const page = document.createElement('div')
    page.className = 'page'

    page.innerHTML = `
    <header class="page-header">
      <span class="page-index">π — The Constant</span>
      <h2 class="page-title">Many Roads to Pi</h2>
      <p class="page-subtitle">
        π is irrational, transcendental, and ubiquitous. Here are several ways
        to calculate it — each illuminating a different corner of mathematics.
        Choose a method to explore.
      </p>
    </header>

    <div class="home-grid">
      ${methodPages
        .map(
          m => `
        <a class="method-card" href="#${m.hash}" data-page="${m.hash}">
          <div class="method-card-index">${m.index}</div>
          <div class="method-card-title">${m.title}</div>
          <p class="method-card-desc">${m.desc}</p>
        </a>
      `
        )
        .join('')}
    </div>
    `

    return page
  }

  return { render, cleanup: () => {} }
}
