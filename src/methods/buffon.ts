import type { Page } from '../router'

// ─── Page Factory ─────────────────────────────────────────────────────────────
// Buffon's Needle is the next method to implement.
// This placeholder page describes the method and
// serves as a skeleton ready to be filled in.

export function createBuffonPage(): Page {
  function render(): HTMLElement {
    const page = document.createElement('div')
    page.className = 'page'

    page.innerHTML = `
      <header class="page-header">
        <span class="page-index">Method 03</span>
        <h2 class="page-title">Buffon's Needle</h2>
        <p class="page-subtitle">
          A physical probability experiment that produces π.
        </p>
      </header>

      <div class="explanation" style="max-width: 640px">
        <h3>Coming soon</h3>
        <p>
          In 1777, Georges-Louis Leclerc, Comte de Buffon, posed a deceptively
          simple question: if you drop a needle of length <em>l</em> onto a
          floor with parallel lines spaced <em>d</em> apart (where l ≤ d),
          what is the probability it crosses a line?
        </p>
        <div class="formula">P(cross) = 2l / (d × π)</div>
        <p>
          Rearranging, we get π = 2l / (d × P). By dropping many needles and
          counting crossings, we can estimate P — and from that, π.
        </p>
        <p>
          This visualisation will animate needles falling, track crossings, and
          show the π estimate converging in real time. It's one of the most
          visually satisfying of all the methods.
        </p>
      </div>
    `

    return page
  }

  return { render, cleanup: () => {} }
}
