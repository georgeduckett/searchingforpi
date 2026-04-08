// ─── Easing Functions ─────────────────────────────────────────────────────────
// Provides easing functions for smooth animations.

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
  draw(ctx: import('../page/types').MethodPageContext<S>): void
  /** Called when animation completes */
  onComplete?: (ctx: import('../page/types').MethodPageContext<S>) => void
}

/**
 * Animation loop controller for eased animations.
 * Reuses the FrameAnimationLoop interface.
 */
export type EasedAnimationLoop = import('./frame').FrameAnimationLoop

/**
 * Creates an eased one-shot animation for entrance animations, transitions, etc.
 *
 * @example
 * ```ts
 * const anim = createEasedAnimation(context, {
 *   durationMs: 1000,
 *   easing: Easing.easeOutCubic,
 *   update: (state, progress) => {
 *     state.currentY = state.startY + (state.endY - state.startY) * progress
 *   },
 *   draw: (ctx) => { renderNeedle(ctx) }
 * })
 * anim.start()
 * ```
 */
export function createEasedAnimation<S>(
  ctx: import('../page/types').MethodPageContext<S>,
  options: EasedAnimationOptions<S>
): EasedAnimationLoop {
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
