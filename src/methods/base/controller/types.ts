// ─── Controller Type Definitions ──────────────────────────────────────────────
// All type definitions for animation controllers.

import type { MethodPageContext } from '../page/types'

// ─── Base State Interface ─────────────────────────────────────────────────────

/**
 * Base state interface for animation controllers.
 * Pages using the controller must extend this interface.
 */
export interface AnimationStateBase {
  /** Whether the animation is currently running */
  running: boolean
  /** Animation frame or interval ID for cleanup */
  rafId?: number | null
  intervalId?: ReturnType<typeof setInterval> | null
}

// ─── Button Configuration ─────────────────────────────────────────────────────

/**
 * Configuration for standard Start/Step/Reset buttons.
 */
export interface StandardButtonsConfig {
  /** Start button element */
  btnStart: HTMLButtonElement
  /** Step button element (optional) */
  btnStep?: HTMLButtonElement | null
  /** Reset button element */
  btnReset: HTMLButtonElement
  /** Label for start button when ready to start (default: 'Start') */
  startLabel?: string
  /** Label for start button when running (default: 'Running…') */
  runningLabel?: string
  /** Label for start button when paused (default: 'Resume') */
  resumeLabel?: string
  /** Label for start button when complete (default: 'Done') */
  doneLabel?: string
}

// ─── Controller Configuration ─────────────────────────────────────────────────

/**
 * Configuration for frame-based animation controller.
 */
export interface FrameControllerConfig<S extends AnimationStateBase> {
  /** The page context */
  ctx: MethodPageContext<S>
  /** Button configuration */
  buttons: StandardButtonsConfig
  /** Called each frame to update state */
  update: (state: S, dt: number) => void
  /** Called each frame to render */
  draw: (ctx: MethodPageContext<S>) => void
  /** Called to check if animation should stop (beyond running flag) */
  isComplete?: (state: S) => boolean
  /** Called when animation completes naturally */
  onComplete?: () => void
  /** Called when reset is triggered */
  onReset: () => void
  /** Called for step button click (if btnStep provided) */
  onStep?: () => void
  /** Called after starting */
  onStart?: () => void
  /** Called after stopping */
  onStop?: () => void
}

/**
 * Configuration for interval-based animation controller.
 */
export interface IntervalControllerConfig<S extends AnimationStateBase> {
  /** The page context */
  ctx: MethodPageContext<S>
  /** Button configuration */
  buttons: StandardButtonsConfig
  /** Interval in milliseconds between ticks */
  intervalMs: number
  /** Called each interval tick */
  tick: (ctx: MethodPageContext<S>) => void
  /** Called to check if animation should stop (beyond running flag) */
  isComplete?: (state: S) => boolean
  /** Called when animation completes naturally */
  onComplete?: () => void
  /** Called when reset is triggered */
  onReset: () => void
  /** Called for step button click (if btnStep provided) */
  onStep?: () => void
  /** Called after starting */
  onStart?: () => void
  /** Called after stopping */
  onStop?: () => void
}

// ─── Controller Interface ─────────────────────────────────────────────────────

/**
 * Controller interface returned by factory functions.
 */
export interface AnimationController {
  /** Start the animation */
  start(): void
  /** Stop/pause the animation */
  stop(): void
  /** Toggle between running and paused */
  toggle(): void
  /** Reset to initial state */
  reset(): void
  /** Perform a single step (if applicable) */
  step(): void
  /** Check if animation is currently running */
  isRunning(): boolean
  /** Cleanup resources */
  cleanup(): void
}

// ─── Simple Button Binder ─────────────────────────────────────────────────────

/**
 * Simple button binding for pages that need manual control.
 * Use this when you need custom animation logic but still want standard button wiring.
 */
export interface SimpleButtonBinder {
  /** Bind start button with handler */
  onStart(handler: () => void): void
  /** Bind step button with handler (if exists) */
  onStep(handler: () => void): void
  /** Bind reset button with handler */
  onReset(handler: () => void): void
  /** Update button states for running */
  setRunning(running: boolean): void
  /** Update button states for completion */
  setComplete(): void
}
