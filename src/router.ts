// ─── Router ────────────────────────────────────────────────────────────────
// A minimal hash-based router. Each page registers itself as a factory
// that returns { render: () => HTMLElement, cleanup: () => void }.

export interface Page {
  /** Called to build and return the page's DOM element. */
  render(): HTMLElement
  /** Called when the page is about to be replaced — cancel timers etc. */
  cleanup(): void
}

export type PageFactory = () => Page

const registry = new Map<string, PageFactory>()

/** Register a page factory under a hash key (e.g. 'monte-carlo'). */
export function registerPage(hash: string, factory: PageFactory): void {
  registry.set(hash, factory)
}

// Track the active page so we can call cleanup() before switching.
let activePage: Page | null = null

function navigate(hash: string): void {
  const container = document.getElementById('page-container')
  if (!container) return

  // Clean up the previous page (stop animations, clear intervals, etc.)
  if (activePage) {
    activePage.cleanup()
    activePage = null
  }

  const factory = registry.get(hash) ?? registry.get('home')
  if (!factory) return

  activePage = factory()
  container.innerHTML = ''
  container.appendChild(activePage.render())

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(el => {
    const link = el as HTMLAnchorElement
    link.classList.toggle('active', link.dataset['page'] === hash)
  })
}

/** Initialise the router — call once on startup. */
export function initRouter(): void {
  // Listen for hash changes (back/forward, clicking nav links)
  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace('#', '') || 'home'
    navigate(hash)
  })

  // Navigate to the initial hash on load
  const initial = location.hash.replace('#', '') || 'home'
  navigate(initial)
}
