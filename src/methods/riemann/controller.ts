// ─── Riemann Integral Controller ──────────────────────────────────────────────
// Main controller factory for the Riemann integral method.
// Wires up buttons and manages the animation lifecycle.

import type { MethodPageContext } from '../base/page/types'
import { State, MAX_RECTS } from './types'
import { draw } from './rendering'
import { createStatsUpdater, type StatsElements } from './stats'

// ─── Controller Actions ────────────────────────────────────────────────────────

/**
 * Add rectangles to the visualization.
 */
export function addRects(
  state: State,
  count: number,
  ctx2d: CanvasRenderingContext2D,
  updateStats: () => void,
  onStop: () => void
): void {
  state.rects = Math.min(state.rects + count, MAX_RECTS)
  draw(ctx2d, state)
  updateStats()
  if (state.rects >= MAX_RECTS) {
    onStop()
  }
}

/**
 * Start the automatic animation.
 */
export function start(
  state: State,
  buttons: { btnStart: HTMLButtonElement; btnReset: HTMLButtonElement },
  addRectsFn: () => void
): void {
  state.running = true
  buttons.btnStart.disabled = true
  buttons.btnReset.disabled = false
  buttons.btnStart.textContent = 'Running…'
  state.intervalId = setInterval(addRectsFn, 100)
}

/**
 * Stop the automatic animation.
 */
export function stop(
  state: State,
  buttons: { btnStart: HTMLButtonElement }
): void {
  state.running = false
  if (state.intervalId !== null) {
    clearInterval(state.intervalId)
    state.intervalId = null
  }
  buttons.btnStart.disabled = state.rects >= MAX_RECTS
  buttons.btnStart.textContent = state.rects >= MAX_RECTS ? 'Done' : 'Start'
}

/**
 * Reset to initial state.
 */
export function reset(
  state: State,
  ctx2d: CanvasRenderingContext2D,
  buttons: { btnStart: HTMLButtonElement; btnReset: HTMLButtonElement },
  updateStats: () => void
): void {
  state.rects = 0
  draw(ctx2d, state)
  updateStats()
  buttons.btnStart.disabled = false
  buttons.btnStart.textContent = 'Start'
  buttons.btnReset.disabled = true
}

// ─── Controller Factory ────────────────────────────────────────────────────────

/**
 * Creates the full animation controller for Riemann method.
 * This wires up all buttons and manages the animation lifecycle.
 */
export function createRiemannController(
  ctx: MethodPageContext<State>,
  elements: StatsElements
): {
  start: () => void
  stop: () => void
  reset: () => void
  addRects: (count: number) => void
  cleanup: () => void
} {
  const { ctx: ctx2d, state, $id } = ctx

  // Get button references
  const btnStart = $id('btn-start', HTMLButtonElement)
  const btnStep = $id('btn-step', HTMLButtonElement)
  const btnReset = $id('btn-reset', HTMLButtonElement)

  const buttons = { btnStart, btnReset }

  // Create stats updater
  const updateStats = createStatsUpdater(elements, state)

  // Create bound addRects function
  const boundAddRects = () => {
    addRects(state, 5, ctx2d, updateStats, () => stop(state, buttons))
  }

  // Initial draw
  draw(ctx2d, state)
  updateStats()

  // Wire up buttons
  btnStart.addEventListener('click', () => {
    if (!state.running) start(state, buttons, boundAddRects)
  })

  btnStep.addEventListener('click', () => {
    if (!state.running) {
      addRects(state, 5, ctx2d, updateStats, () => stop(state, buttons))
      btnReset.disabled = false
    }
  })

  btnReset.addEventListener('click', () => {
    stop(state, buttons)
    reset(state, ctx2d, buttons, updateStats)
  })

  return {
    start: () => start(state, buttons, boundAddRects),
    stop: () => stop(state, buttons),
    reset: () => {
      stop(state, buttons)
      reset(state, ctx2d, buttons, updateStats)
    },
    addRects: (count: number) => {
      addRects(state, count, ctx2d, updateStats, () => stop(state, buttons))
    },
    cleanup: () => {
      if (state.intervalId !== null) {
        clearInterval(state.intervalId)
        state.intervalId = null
      }
      state.running = false
    },
  }
}

// Re-export types for backward compatibility
export type { StatsElements } from './stats'
