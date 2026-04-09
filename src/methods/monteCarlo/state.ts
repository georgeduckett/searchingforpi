// ─── Monte Carlo State ────────────────────────────────────────────────────────
// State type definition and factory for the Monte Carlo method.

import type { AnimationController } from '../base/controller'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface State {
  inside: number
  total: number
  running: boolean
  rafId: number | null
  intervalId: ReturnType<typeof setInterval> | null // For AnimationState compatibility
  /** Controller instance for cleanup (set during init) */
  _controller?: AnimationController
}

// ─── Initial State Factory ───────────────────────────────────────────────────

export function createInitialState(): State {
  return {
    inside: 0,
    total: 0,
    running: false,
    rafId: null,
    intervalId: null,
  }
}
