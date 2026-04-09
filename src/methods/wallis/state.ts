// ─── Wallis Product State ──────────────────────────────────────────────────────
// State type definition and factory for the Wallis product method.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface State {
  factors: number // Number of factors computed (each term-pair has 2 factors)
  product: number
  running: boolean
  intervalId: ReturnType<typeof setInterval> | null
  /** Controller instance for cleanup (set during init) */
  _controller?: { cleanup(): void }
}

// ─── Initial State Factory ───────────────────────────────────────────────────

export function createInitialState(): State {
  return {
    factors: 0,
    product: 1,
    running: false,
    intervalId: null,
  }
}
