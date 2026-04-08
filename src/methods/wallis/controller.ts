// ─── Wallis Product Controller ────────────────────────────────────────────────
// Animation control logic for the Wallis product method.
// Extracted from page.ts for better separation of concerns.

import { fmt } from '../../utils'
import type { MethodPageContext } from '../base/page/types'
import { State, MAX_FACTORS, getFactor, estimatePi } from './types'
import { draw } from './rendering'

// ─── Stats Element References ──────────────────────────────────────────────────

export interface StatsElements {
  estimate: HTMLElement
  factors: HTMLElement
  product: HTMLElement
  error: HTMLElement
}

// ─── Stats Management ──────────────────────────────────────────────────────────

/**
 * Creates a stats updater function for Wallis method.
 */
export function createStatsUpdater(
  elements: StatsElements,
  state: State
): () => void {
  return function updateStats(): void {
    const piEstimate = estimatePi(state.product)
    const error = Math.abs(piEstimate - Math.PI)

    elements.estimate.textContent = fmt(piEstimate)
    elements.factors.textContent = state.factors.toLocaleString()
    elements.product.textContent = fmt(state.product)
    elements.error.textContent = `Error: ${fmt(error)}`
    elements.error.className = 'stat-error ' + (error < 0.1 ? 'improving' : 'neutral')
  }
}

// ─── Controller Actions ────────────────────────────────────────────────────────

/**
 * Add a single factor to the product.
 */
export function addFactor(
  state: State,
  ctx2d: CanvasRenderingContext2D,
  updateStats: () => void,
  onStop: () => void
): void {
  state.factors++
  state.product *= getFactor(state.factors)

  draw(ctx2d, state)
  updateStats()
  if (state.factors >= MAX_FACTORS) {
    onStop()
  }
}

/**
 * Start the automatic animation.
 */
export function start(
  state: State,
  buttons: { btnStart: HTMLButtonElement; btnReset: HTMLButtonElement },
  addFactorFn: () => void
): void {
  state.running = true
  buttons.btnStart.disabled = true
  buttons.btnReset.disabled = false
  buttons.btnStart.textContent = 'Running…'
  state.intervalId = setInterval(addFactorFn, 50)
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
  buttons.btnStart.disabled = state.factors >= MAX_FACTORS
  buttons.btnStart.textContent = state.factors >= MAX_FACTORS ? 'Done' : 'Start'
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
  state.factors = 0
  state.product = 1
  draw(ctx2d, state)
  updateStats()
  buttons.btnStart.disabled = false
  buttons.btnStart.textContent = 'Start'
  buttons.btnReset.disabled = true
}

// ─── Controller Factory ────────────────────────────────────────────────────────

/**
 * Creates the full animation controller for Wallis method.
 * This wires up all buttons and manages the animation lifecycle.
 */
export function createWallisController(
  ctx: MethodPageContext<State>,
  elements: StatsElements
): {
  start: () => void
  stop: () => void
  reset: () => void
  addFactor: () => void
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

  // Create bound addFactor function
  const boundAddFactor = () => {
    addFactor(state, ctx2d, updateStats, () => stop(state, buttons))
  }

  // Initial draw
  draw(ctx2d, state)
  updateStats()

  // Wire up buttons
  btnStart.addEventListener('click', () => {
    if (!state.running) start(state, buttons, boundAddFactor)
  })

  btnStep.addEventListener('click', () => {
    if (!state.running) {
      boundAddFactor()
      btnReset.disabled = false
    }
  })

  btnReset.addEventListener('click', () => {
    stop(state, buttons)
    reset(state, ctx2d, buttons, updateStats)
  })

  return {
    start: () => start(state, buttons, boundAddFactor),
    stop: () => stop(state, buttons),
    reset: () => {
      stop(state, buttons)
      reset(state, ctx2d, buttons, updateStats)
    },
    addFactor: boundAddFactor,
    cleanup: () => {
      if (state.intervalId !== null) {
        clearInterval(state.intervalId)
        state.intervalId = null
      }
      state.running = false
    },
  }
}
