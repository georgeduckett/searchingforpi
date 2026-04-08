// ─── Frame-Based Animation (requestAnimationFrame) ────────────────────────────
// Provides requestAnimationFrame-based animation loops with lifecycle management.

import type { MethodPageContext } from '../page/types'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Factory Function ─────────────────────────────────────────────────────────

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
