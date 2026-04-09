// ─── Wallis Product Method Barrel Export ───────────────────────────────────────
// Re-exports all wallis method components.

// Constants
export { MAX_FACTORS } from './constants'

// State
export type { State } from './state'
export { createInitialState } from './state'

// Mathematics
export { getFactor, estimatePi, getTarget } from './math'

// Controller
export { createWallisController, addFactor, type StatsElements } from './controller'

// Page factory
export { createWallisPage } from './page'

// Preview
export { drawPreview } from './preview'

// Rendering
export { draw } from './rendering'

// Stats
export { createStatsUpdater } from './stats'
