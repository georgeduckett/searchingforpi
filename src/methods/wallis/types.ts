// ─── Wallis Product Types Barrel Export ────────────────────────────────────────
// Re-exports all types, constants, and functions for backward compatibility.

// Constants
export { MAX_FACTORS } from './constants'

// State
export type { State } from './state'
export { createInitialState } from './state'

// Mathematics
export { getFactor, estimatePi, getTarget } from './math'
