// ─── Interval-Based Animation (setInterval) ──────────────────────────────────
// Provides setInterval-based animation for fixed-timestep updates.

import type { MethodPageContext } from '../page/types'

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Options for configuring an interval-based animation.
 */
export interface IntervalAnimationOptions<S> {
  /** Interval in milliseconds between ticks */
  intervalMs: number
  /** Called each interval tick */
  tick(ctx: MethodPageContext<S>): void
  /** Check if animation should continue running */
  isRunning(state: S): boolean
  /** Called when animation completes naturally */
  onComplete?: (ctx: MethodPageContext<S>) => void
}

/**
 * Interval animation controller returned by createIntervalAnimation.
 */
export interface IntervalAnimationLoop {
  /** Start the interval animation */
  start(): void
  /** Stop the interval animation */
  stop(): void
  /** Check if the animation is currently running */
  isRunning(): boolean
  /** Get the interval ID (for cleanup) */
  getIntervalId(): ReturnType<typeof setInterval> | null
}

// ─── Factory Function ─────────────────────────────────────────────────────────

/**
 * Creates a setInterval-based animation for fixed-timestep updates.
 * Useful for methods like Leibniz that add terms at regular intervals.
 *
 * @example
 * ```ts
 * const loop = createIntervalAnimation(context, {
 *   intervalMs: 40,
 *   tick: (ctx) => { addTerm(ctx.state) },
 *   isRunning: (state) => state.running
 * })
 * loop.start()
 * ```
 */
export function createIntervalAnimation<S>(
  ctx: MethodPageContext<S>,
  options: IntervalAnimationOptions<S>
): IntervalAnimationLoop {
  let intervalId: ReturnType<typeof setInterval> | null = null

  function tick(): void {
    if (!options.isRunning(ctx.state)) {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
      options.onComplete?.(ctx)
      return
    }
    options.tick(ctx)
  }

  return {
    start() {
      if (intervalId === null) {
        intervalId = setInterval(tick, options.intervalMs)
      }
    },
    stop() {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
    isRunning() {
      return intervalId !== null
    },
    getIntervalId() {
      return intervalId
    },
  }
}
