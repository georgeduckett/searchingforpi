// ─── Mobile Page Navigation ─────────────────────────────────────────────────
// Handles prev/next page buttons for mobile navigation.

import { hasPrevPage, hasNextPage, navigateToPrev, navigateToNext } from '../router'

/**
 * Update the disabled state of prev/next navigation buttons.
 */
function updateNavButtons(): void {
  const navPrevBtn = document.getElementById('nav-prev') as HTMLButtonElement | null
  const navNextBtn = document.getElementById('nav-next') as HTMLButtonElement | null

  if (navPrevBtn) {
    navPrevBtn.disabled = !hasPrevPage()
  }
  if (navNextBtn) {
    navNextBtn.disabled = !hasNextPage()
  }
}

/**
 * Initialize mobile page navigation (prev/next buttons).
 */
export function initPageNav(): void {
  const navPrevBtn = document.getElementById('nav-prev') as HTMLButtonElement | null
  const navNextBtn = document.getElementById('nav-next') as HTMLButtonElement | null

  if (navPrevBtn) {
    navPrevBtn.addEventListener('click', () => {
      navigateToPrev()
    })
  }

  if (navNextBtn) {
    navNextBtn.addEventListener('click', () => {
      navigateToNext()
    })
  }

  // Update button states on page change
  window.addEventListener('pagechange', updateNavButtons)

  // Initial button state update
  updateNavButtons()
}
