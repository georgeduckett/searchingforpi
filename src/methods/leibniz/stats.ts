// ─── Leibniz Series Stats Management ──────────────────────────────────────────
// Stats update logic for the Leibniz series method.

import { createStatsUpdater as buildStatsUpdater } from '../base/statsHelpers'
import { State } from './types'
import { formatTerm } from './series'

// ─── Stats Element References ──────────────────────────────────────────────────

export interface StatsElements {
  estimate: HTMLElement
  terms: HTMLElement
  currentTerm: HTMLElement
  error: HTMLElement
}

// ─── Stats Management ──────────────────────────────────────────────────────────

/**
 * Creates a stats updater function for Leibniz method.
 */
export function createStatsUpdater(elements: StatsElements, state: State): () => void {
  return buildStatsUpdater()
    .custom(() => {
      const n = state.terms.length
      if (n === 0) {
        elements.estimate.textContent = '—'
        elements.terms.textContent = '0'
        elements.currentTerm.textContent = '—'
        elements.error.textContent = '—'
        return
      }
      const pi = state.terms[n - 1]
      elements.estimate.textContent = pi.toFixed(8)
      elements.terms.textContent = n.toLocaleString()
      const idx = n - 1
      const formatted = formatTerm(idx)
      elements.currentTerm.textContent = `${formatted.sign}1/${formatted.denominator} = ${formatted.sign}${formatted.value.toFixed(6)}`
      elements.error.textContent = Math.abs(pi - Math.PI).toFixed(8)
    })
    .build()
}
