// ─── Leibniz Series State ─────────────────────────────────────────────────────
// State type definition and factory for the Leibniz series method.

import type { AnimationController } from '../base/controller'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface State {
  terms: number[]
  running: boolean
  termIndex: number
  intervalId: ReturnType<typeof setInterval> | null
  rafId: number | null // For AnimationState compatibility
  /** Controller instance for cleanup (set during init) */
  _controller?: AnimationController
}

// ─── Initial State Factory ───────────────────────────────────────────────────

export function createInitialState(): State {
  return {
    terms: [],
    running: false,
    termIndex: 0,
    intervalId: null,
    rafId: null,
  }
}
