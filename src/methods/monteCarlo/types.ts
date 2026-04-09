// ─── Monte Carlo Types Barrel Export ──────────────────────────────────────────
// Re-exports all types, constants, and functions for backward compatibility.

// Constants
export {
  DOTS_PER_TICK,
  MAX_DOTS,
  DOT_RADIUS,
  DOT_ALPHA,
  PREVIEW_DOT_RADIUS,
  CIRCLE_RADIUS_FACTOR,
  CIRCLE_RADIUS,
} from './constants'

// State
export type { State } from './state'
export { createInitialState } from './state'
