// ─── Controller Module Barrel Export ──────────────────────────────────────────
// Re-exports all controller-related types and functions.

// Types
export type {
  AnimationStateBase,
  StandardButtonsConfig,
  FrameControllerConfig,
  IntervalControllerConfig,
  AnimationController,
  SimpleButtonBinder,
} from './types'

// Frame-based controller
export { createFrameController } from './frame'

// Interval-based controller
export { createIntervalController } from './interval'

// Button binding
export { bindButtons } from './buttons'
