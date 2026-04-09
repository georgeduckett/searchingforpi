// ─── Riemann Integral State ────────────────────────────────────────────────────
// State type definition and factory for the Riemann integral method.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface State {
  rects: number
  running: boolean
  intervalId: ReturnType<typeof setInterval> | null
  /** Controller instance for cleanup (set during init) */
  _controller?: { cleanup(): void }
}

// ─── State Factory ───────────────────────────────────────────────────────────

export function createInitialState(): State {
  return {
    rects: 0,
    running: false,
    intervalId: null,
  }
}
