// ─── Monte Carlo Stats Management ─────────────────────────────────────────────
// Stats update logic for the Monte Carlo method.

import { createStatsUpdater as buildStatsUpdater } from '../base/statsHelpers'
import { State, MAX_DOTS } from './types'
import { estimatePi } from './sampling'

// ─── Stats Element References ──────────────────────────────────────────────────

export interface StatsElements {
  estimate: HTMLElement
  total: HTMLElement
  error: HTMLElement
  progress: HTMLElement
}

// ─── Stats Management ──────────────────────────────────────────────────────────

/**
 * Creates a stats updater function for Monte Carlo.
 */
export function createStatsUpdater(elements: StatsElements, state: State): () => void {
  return buildStatsUpdater()
    .piEstimate(elements.estimate, () => estimatePi(state.inside, state.total), {
      improvingThreshold: 0.01,
    })
    .counter(elements.total, () => state.total)
    .error(elements.error, () => Math.abs(estimatePi(state.inside, state.total) - Math.PI), {
      threshold: 0.01,
    })
    .progress(elements.progress, () => state.total, MAX_DOTS)
    .build()
}
