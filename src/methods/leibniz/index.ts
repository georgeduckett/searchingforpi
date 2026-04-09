// ─── Leibniz Series Method Barrel Export ──────────────────────────────────────
// Re-exports all leibniz method components.

// Constants
export { CANVAS_W, CANVAS_H, MAX_TERMS, MS_PER_TERM } from './constants'

// State
export type { State } from './state'
export { createInitialState } from './state'

// Controller
export { createLeibnizController, addTerm, type StatsElements } from './controller'

// Page factory
export { createLeibnizPage } from './page'

// Preview
export { drawPreview } from './preview'

// Rendering
export { draw } from './rendering'

// Series math
export { leibnizTerm, formatTerm } from './series'

// Stats
export { createStatsUpdater } from './stats'
