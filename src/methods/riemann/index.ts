// ─── Riemann Integral Method Barrel Export ─────────────────────────────────────
// Re-exports all riemann method components.

// Constants
export { MAX_RECTS } from './constants'

// State
export type { State } from './state'
export { createInitialState } from './state'

// Mathematics
export { f, computeSum } from './math'

// Controller
export { createRiemannController, addRects, start, stop, reset, type StatsElements } from './controller'

// Page factory
export { createRiemannPage } from './page'

// Preview
export { drawPreview } from './preview'

// Rendering
export { draw } from './rendering'

// Stats
export { createStatsUpdater } from './stats'
