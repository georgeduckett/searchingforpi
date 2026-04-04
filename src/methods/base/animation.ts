// ─── Animation Loop Helpers ─────────────────────────────────────────────────
// Provides requestAnimationFrame and setInterval-based animation loops with lifecycle management.

import type { MethodPageContext } from './page/types'

// ─── Frame-Based Animation (requestAnimationFrame) ───────────────────────────

/**
 * Options for configuring a frame-based animation loop.
 */
export interface FrameAnimationOptions<S> {
  /** Called each frame with delta time in seconds */
  update(state: S, dt: number): void
  /** Called each frame to render */
  draw(ctx: MethodPageContext<S>): void
  /** Check if animation should continue running */
  isRunning(state: S): boolean
  /** Called when animation completes naturally (isRunning returns false) */
  onComplete?: (ctx: MethodPageContext<S>) => void
}

/**
 * Animation loop controller returned by createFrameAnimation.
 */
export interface FrameAnimationLoop {
  /** Start the animation loop */
  start(): void
  /** Stop the animation loop */
  stop(): void
  /** Check if the loop is currently running */
  isRunning(): boolean
  /** Get the animation frame ID (for cleanup) */
  getFrameId(): number | null
}

/**
 * Creates a requestAnimationFrame-based animation loop.
 * Handles starting, stopping, and cleanup automatically.
 *
 * @example
 * ```ts
 * const loop = createFrameAnimation(context, {
 *   update: (state, dt) => { state.progress += dt },
 *   draw: (ctx) => { renderState(ctx) },
 *   isRunning: (state) => state.running
 * })
 * loop.start()
 * ```
 */
export function createFrameAnimation<S>(
  ctx: MethodPageContext<S>,
  options: FrameAnimationOptions<S>
): FrameAnimationLoop {
  let animationId: number | null = null
  let lastTime = 0

  function tick(timestamp: number): void {
    if (!options.isRunning(ctx.state)) {
      animationId = null
      options.onComplete?.(ctx)
      return
    }

    const dt = lastTime ? (timestamp - lastTime) / 1000 : 0
    lastTime = timestamp

    options.update(ctx.state, dt)
    options.draw(ctx)

    animationId = requestAnimationFrame(tick)
  }

  return {
    start() {
      if (animationId === null) {
        lastTime = 0
        animationId = requestAnimationFrame(tick)
      }
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    },
    isRunning() {
      return animationId !== null
    },
    getFrameId() {
      return animationId
    },
  }
}

// ─── Interval-Based Animation (setInterval) ──────────────────────────────────

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

// ─── Eased Animation Helper ─────────────────────────────────────────────────

/**
 * Easing functions for smooth animations.
 */
export const Easing = {
  /** Linear easing (no acceleration) */
  linear: (t: number) => t,
  /** Quadratic ease-in (acceleration) */
  easeIn: (t: number) => t * t,
  /** Quadratic ease-out (deceleration) */
  easeOut: (t: number) => t * (2 - t),
  /** Quadratic ease-in-out */
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  /** Cubic ease-in */
  easeInCubic: (t: number) => t * t * t,
  /** Cubic ease-out */
  easeOutCubic: (t: number) => --t * t * t + 1,
  /** Cubic ease-in-out */
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
} as const

/**
 * Options for eased one-shot animations.
 */
export interface EasedAnimationOptions<S> {
  /** Duration of the animation in milliseconds */
  durationMs: number
  /** Easing function to apply */
  easing?: (t: number) => number
  /** Called each frame with progress (0-1) and delta time */
  update(state: S, progress: number, dt: number): void
  /** Called each frame to render */
  draw(ctx: MethodPageContext<S>): void
  /** Called when animation completes */
  onComplete?: (ctx: MethodPageContext<S>) => void
}

/**
 * Eased animation controller for one-shot animations with easing.
 * Useful for entrance animations, transitions, etc.
 *
 * @example
 * ```ts
 * const anim = createEasedAnimation(context, {
 *   durationMs: 1000,
 *   easing: Easing.easeOutCubic,
 *   update: (state, progress) => {
 *   state.currentY = state.startY + (state.endY - state.startY) * progress
 * },
 *   draw: (ctx) => { renderNeedle(ctx) }
 * })
 * anim.start()
 * ```
 */
export function createEasedAnimation<S>(
  ctx: MethodPageContext<S>,
  options: EasedAnimationOptions<S>
): FrameAnimationLoop {
  const { durationMs, easing = Easing.linear, update, draw, onComplete } = options
  let startTime: number | null = null
  let animationId: number | null = null

  function tick(timestamp: number): void {
    if (startTime === null) {
      startTime = timestamp
    }

    const elapsed = timestamp - startTime
    const rawProgress = Math.min(elapsed / durationMs, 1)
    const progress = easing(rawProgress)
    const dt = 0 // Not meaningful for eased animations

    update(ctx.state, progress, dt)
    draw(ctx)

    if (rawProgress < 1) {
      animationId = requestAnimationFrame(tick)
    } else {
      animationId = null
      onComplete?.(ctx)
    }
  }

  return {
    start() {
      if (animationId === null) {
        startTime = null
        animationId = requestAnimationFrame(tick)
      }
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    },
    isRunning() {
      return animationId !== null
    },
    getFrameId() {
      return animationId
    },
  }
}

// ─── Animation State Tracker ────────────────────────────────────────────────

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
