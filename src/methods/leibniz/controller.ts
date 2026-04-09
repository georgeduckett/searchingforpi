// ─── Leibniz Series Controller ────────────────────────────────────────────────
// Main controller factory for the Leibniz series method.
// Wires up buttons and manages the animation lifecycle.

import type { MethodPageContext } from '../base/page/types'
import { createIntervalController, type AnimationController } from '../base/controller'
import { State, MAX_TERMS, MS_PER_TERM } from './types'
import { leibnizTerm } from './series'
import { draw } from './rendering'
import { createStatsUpdater, type StatsElements } from './stats'

// ─── Animation Logic ──────────────────────────────────────────────────────────

/**
 * Add a term to the series and update visualization.
 */
export function addTerm(state: State, ctx2d: CanvasRenderingContext2D): void {
  const n = state.termIndex
  const prev = state.terms.length > 0 ? state.terms[state.terms.length - 1] : 0
  const newSum = prev + leibnizTerm(n) * 4
  state.terms.push(newSum)
  state.termIndex++
  draw(ctx2d, state)
}

// ─── Controller Factory ───────────────────────────────────────────────────────

/**
 * Creates the full animation controller for Leibniz method.
 * This wires up all buttons and manages the animation lifecycle.
 */
export function createLeibnizController(
  ctx: MethodPageContext<State>,
  elements: StatsElements
): AnimationController {
  const { ctx: ctx2d, state, $id } = ctx

  // Get button references
  const btnStart = $id('btn-start', HTMLButtonElement)
  const btnStep = $id('btn-step', HTMLButtonElement)
  const btnReset = $id('btn-reset', HTMLButtonElement)

  // Create stats updater
  const updateStats = createStatsUpdater(elements, state)

  // Initial draw
  draw(ctx2d, state)

  // Create the interval controller
  const controller = createIntervalController({
    ctx,
    buttons: { btnStart, btnStep, btnReset },
    intervalMs: MS_PER_TERM,
    tick: () => {
      addTerm(state, ctx2d)
      updateStats()
    },
    isComplete: state => state.termIndex >= MAX_TERMS,
    onComplete: () => {
      btnStart.disabled = false
      btnStart.textContent = state.termIndex >= MAX_TERMS ? 'Done' : 'Resume'
      if (state.termIndex >= MAX_TERMS) btnStart.disabled = true
    },
    onReset: () => {
      state.terms = []
      state.termIndex = 0
      draw(ctx2d, state)
      updateStats()
    },
    onStep: () => {
      // First step adds 2 terms (to show + and -), subsequent steps add 1
      const steps = state.termIndex === 0 ? 2 : 1
      for (let i = 0; i < steps; i++) {
        addTerm(state, ctx2d)
      }
      updateStats()
    },
  })

  return controller
}

// Re-export types for backward compatibility
export type { StatsElements } from './stats'
