// ─── Archimedes Controller ────────────────────────────────────────────────────
// Animation control logic for the Archimedes polygons method.
// Extracted from page.ts for better separation of concerns.

import { fmt } from '../../utils'
import type { MethodPageContext } from '../base/page/types'
import { State, INITIAL_SIDES, MAX_ITERATIONS, calculateBounds, estimatePi, calculateGap } from './types'
import { draw } from './rendering'

// ─── Stats Element References ──────────────────────────────────────────────────

export interface StatsElements {
  estimate: HTMLElement
  error: HTMLElement
  sides: HTMLElement
  lower: HTMLElement
  upper: HTMLElement
  gap: HTMLElement
}

// ─── Stats Management ──────────────────────────────────────────────────────────

/**
 * Creates a stats updater function for Archimedes method.
 */
export function createStatsUpdater(
  elements: StatsElements,
  state: State
): () => void {
  return function updateStats(): void {
    const currentBounds = calculateBounds(state.sides)
    state.lower = currentBounds.lower
    state.upper = currentBounds.upper

    const est = estimatePi(state.lower, state.upper)
    const error = Math.abs(est - Math.PI)
    const gap = calculateGap(state.lower, state.upper)
    const digits = Math.min(12, 4 + state.iteration)

    elements.estimate.textContent = fmt(est)
    elements.error.textContent = `Error: ${fmt(error)}`
    elements.error.className = 'stat-error ' + (error < 0.01 ? 'improving' : 'neutral')
    elements.sides.textContent = `${state.sides.toLocaleString()} sides`
    elements.lower.textContent = fmt(state.lower, digits)
    elements.upper.textContent = fmt(state.upper, digits)
    elements.gap.textContent = `Gap: ${fmt(gap, digits)}`
    elements.gap.style.color = gap < 0.001 ? '#4ecb71' : 'var(--text-muted)'
  }
}

// ─── Animation Logic ───────────────────────────────────────────────────────────

/**
 * Creates the animation transition function.
 */
export function createAnimateTransition(
  ctx2d: CanvasRenderingContext2D,
  state: State,
  _elements: StatsElements,
  buttons: { btnStep: HTMLButtonElement; btnReset: HTMLButtonElement; btnPlay: HTMLButtonElement; selectIter: HTMLSelectElement },
  updateStats: () => void
): () => void {
  function animateTransition(): void {
    if (state.progress >= 1) {
      state.progress = 0
      state.animating = false
      state.sides = state.targetSides
      updateStats()
      draw(ctx2d, state.sides, state.lower, state.upper)
      buttons.btnStep.disabled = false
      buttons.btnReset.disabled = false
      buttons.btnPlay.disabled = state.iteration >= MAX_ITERATIONS
      buttons.selectIter.disabled = false
      state.animationId = null
      return
    }

    state.progress += 0.04

    const currentLower = state.startLower + (state.endLower - state.startLower) * state.progress
    const currentUpper = state.startUpper + (state.endUpper - state.startUpper) * state.progress
    const currentSides =
      state.startSides + (state.targetSides - state.startSides) * state.progress

    draw(ctx2d, currentSides, currentLower, currentUpper)

    state.animationId = requestAnimationFrame(animateTransition)
  }

  return animateTransition
}

// ─── Controller Actions ────────────────────────────────────────────────────────

/**
 * Step to a specific number of sides with animation.
 */
export function stepTo(
  sides: number,
  state: State,
  _ctx2d: CanvasRenderingContext2D,
  animateTransition: () => void,
  buttons: { btnStep: HTMLButtonElement; btnReset: HTMLButtonElement; selectIter: HTMLSelectElement }
): void {
  if (state.animating) return

  state.startSides = state.sides
  state.startLower = state.lower
  state.startUpper = state.upper

  const newBounds = calculateBounds(sides)
  state.targetSides = sides
  state.endLower = newBounds.lower
  state.endUpper = newBounds.upper

  state.iteration = Math.log2(sides / INITIAL_SIDES)
  state.animating = true
  state.progress = 0

  buttons.btnStep.disabled = true
  buttons.btnReset.disabled = true
  buttons.selectIter.disabled = true

  animateTransition()
}

/**
 * Perform a single step (double the sides).
 */
export function step(
  state: State,
  _buttons: { btnStep: HTMLButtonElement; btnReset: HTMLButtonElement; selectIter: HTMLSelectElement },
  stepToFn: (sides: number) => void
): void {
  const nextSides = state.sides * 2
  if (nextSides > INITIAL_SIDES * Math.pow(2, MAX_ITERATIONS)) return
  stepToFn(nextSides)
}

/**
 * Reset to initial state.
 */
export function reset(
  state: State,
  ctx2d: CanvasRenderingContext2D,
  _elements: StatsElements,
  buttons: { btnStep: HTMLButtonElement; btnPlay: HTMLButtonElement; selectIter: HTMLSelectElement },
  updateStats: () => void
): void {
  if (state.animationId !== null) cancelAnimationFrame(state.animationId)
  state.sides = INITIAL_SIDES
  state.iteration = 0
  state.animating = false
  state.targetSides = INITIAL_SIDES
  state.progress = 0
  state.animationId = null
  updateStats()
  draw(ctx2d, INITIAL_SIDES, state.lower, state.upper)
  buttons.selectIter.value = '0'
  buttons.btnPlay.disabled = false
  buttons.btnStep.disabled = false
}

/**
 * Auto-play sequence - double sides repeatedly.
 */
export function play(
  state: State,
  buttons: { btnPlay: HTMLButtonElement },
  stepToFn: (sides: number) => void
): void {
  if (state.animating) return

  const playSequence = () => {
    const nextSides = state.sides * 2
    if (
      nextSides > INITIAL_SIDES * Math.pow(2, MAX_ITERATIONS) ||
      state.iteration >= MAX_ITERATIONS
    ) {
      buttons.btnPlay.disabled = true
      return
    }
    stepToFn(nextSides)
    setTimeout(() => {
      if (!state.animating && state.iteration < MAX_ITERATIONS) {
        playSequence()
      } else if (state.animating) {
        setTimeout(playSequence, 100)
      }
    }, 600)
  }
  playSequence()
}

// ─── Controller Factory ────────────────────────────────────────────────────────

/**
 * Creates the full animation controller for Archimedes method.
 * This wires up all buttons and manages the animation lifecycle.
 */
export function createArchimedesController(
  ctx: MethodPageContext<State>,
  elements: StatsElements
): {
  start: () => void
  reset: () => void
  step: () => void
  stepTo: (sides: number) => void
  cleanup: () => void
} {
  const { ctx: ctx2d, state, $id } = ctx

  // Get button references
  const btnStep = $id('btn-step', HTMLButtonElement)
  const btnPlay = $id('btn-play', HTMLButtonElement)
  const btnReset = $id('btn-reset', HTMLButtonElement)
  const selectIter = $id('select-iter', HTMLSelectElement)

  const buttons = { btnStep, btnPlay, btnReset, selectIter }

  // Create stats updater
  const updateStats = createStatsUpdater(elements, state)

  // Create animation function
  const animateTransition = createAnimateTransition(ctx2d, state, elements, buttons, updateStats)

  // Create stepTo bound to this context
  const boundStepTo = (sides: number) => {
    stepTo(sides, state, ctx2d, animateTransition, buttons)
  }

  // Initial draw
  updateStats()
  draw(ctx2d, INITIAL_SIDES, state.lower, state.upper)

  // Wire up buttons
  btnStep.addEventListener('click', () => step(state, buttons, boundStepTo))
  btnPlay.addEventListener('click', () => play(state, buttons, boundStepTo))
  btnReset.addEventListener('click', () => reset(state, ctx2d, elements, buttons, updateStats))
  selectIter.addEventListener('change', e => {
    const iter = parseInt((e.target as HTMLSelectElement).value)
    const sides = INITIAL_SIDES * Math.pow(2, iter)
    boundStepTo(sides)
  })

  return {
    start: () => play(state, buttons, boundStepTo),
    reset: () => reset(state, ctx2d, elements, buttons, updateStats),
    step: () => step(state, buttons, boundStepTo),
    stepTo: boundStepTo,
    cleanup: () => {
      if (state.animationId !== null) {
        cancelAnimationFrame(state.animationId)
        state.animationId = null
      }
      state.animating = false
    },
  }
}
