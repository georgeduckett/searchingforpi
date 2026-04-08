// ─── Animation State Tracker ──────────────────────────────────────────────────
// Mixin for state that tracks animation IDs and cleanup helper.

/**
 * Mixin for state that tracks animation IDs.
 * Add this to your state interface for automatic cleanup support.
 */
export interface AnimationState {
  /** Current animation frame ID (for requestAnimationFrame) */
  rafId: number | null
  /** Current interval ID (for setInterval) */
  intervalId: ReturnType<typeof setInterval> | null
  /** Whether the animation is currently running */
  running: boolean
}

/**
 * Helper to cancel any running animations on a state object.
 * Call this in your cleanup method.
 */
export function cancelAnimations(state: AnimationState): void {
  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId)
    state.rafId = null
  }
  if (state.intervalId !== null) {
    clearInterval(state.intervalId)
    state.intervalId = null
  }
  state.running = false
}
