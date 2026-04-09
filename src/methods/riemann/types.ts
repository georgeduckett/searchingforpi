// ─── Riemann Integral Types Barrel Export ──────────────────────────────────────
// Re-exports all types, constants, and functions for backward compatibility.

// Constants
export { MAX_RECTS } from './constants'

// State
export type { State } from './state'
export { createInitialState } from './state'

// Mathematics
export { f, computeSum } from './math'
