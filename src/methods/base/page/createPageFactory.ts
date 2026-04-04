// ─── Simple Page Factory ─────────────────────────────────────────────────────
// Creates a simple page factory with standard layout.
// Best for pages with basic canvas + controls + stats layout.

import type { Page } from '../../../router'
import { queryRequired } from '../../../utils'
import type { PageOptions, PageContext, PageMethods } from './types'

/**
 * Creates a simple page factory with standard layout.
 * Best for pages with basic canvas + controls + stats layout.
 *
 * @example
 * ```ts
 * const createMyPage = createPageFactory<State>(
 *   { title: 'My Page', index: '01' },
 *   { count: 0 },
 *   {
 *     draw(ctx) { /* render canvas *\/ },
 *     reset(ctx) { ctx.state.count = 0 },
 *   }
 * )
 * ```
 */
export function createPageFactory<S>(
  options: PageOptions,
  initialState: S,
  methods: PageMethods<S>
): () => Page {
  const {
    title,
    subtitle,
    index,
    canvasWidth = 560,
    canvasHeight = 560,
    hasStartPause = true,
    hasStep = true,
    hasReset = true,
    extraControls = '',
    extraStats = '',
  } = options

  return function pageFactory(): Page {
    const state: S = JSON.parse(JSON.stringify(initialState))
    let animationId: number | null = null
    let running = false

    // Build control buttons HTML
    const controlsHtml = [
      hasStartPause ? `<button class="btn" id="btn-start">Start</button>` : '',
      hasStep ? `<button class="btn" id="btn-step">Step</button>` : '',
      extraControls,
      hasReset ? `<button class="btn" id="btn-reset">Reset</button>` : '',
    ].filter(Boolean).join('\n')

    function render(): HTMLElement {
      const page = document.createElement('div')
      page.className = 'page'

      page.innerHTML = `
        <header class="page-header">
          ${index ? `<span class="page-index">${index}</span>` : ''}
          <h2 class="page-title">${title}</h2>
          ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
        </header>

        <div class="visualization">
          <canvas id="canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
        </div>

        <div class="controls">
          ${controlsHtml}
        </div>

        <div class="stats-panel">
          ${extraStats}
        </div>
      `

      return page
    }

    function cleanup(): void {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
      running = false

      const ctx: PageContext<S> = {
        canvas: null as unknown as HTMLCanvasElement,
        ctx: null as unknown as CanvasRenderingContext2D,
        btnStart: null,
        btnStep: null,
        btnReset: null,
        state,
        statsContainer: null as unknown as HTMLElement,
      }

      methods.cleanup?.(ctx)
    }

    // The actual page object
    const page: Page = { render, cleanup }

    // Defer initialization until after render
    setTimeout(() => {
      const canvas = queryRequired(document, '#canvas', HTMLCanvasElement)
      const ctx2d = canvas.getContext('2d')
      if (!ctx2d) throw new Error('Could not get 2D context')

      const btnStart = hasStartPause ? queryRequired(document, '#btn-start', HTMLButtonElement) : null
      const btnStep = hasStep ? queryRequired(document, '#btn-step', HTMLButtonElement) : null
      const btnReset = hasReset ? queryRequired(document, '#btn-reset', HTMLButtonElement) : null
      const statsContainer = queryRequired(document, '.stats-panel', HTMLElement)

      const context: PageContext<S> = {
        canvas,
        ctx: ctx2d,
        btnStart,
        btnStep,
        btnReset,
        state,
        statsContainer,
      }

      // Wire up event handlers
      if (btnStart) {
        btnStart.addEventListener('click', () => {
          if (running) {
            running = false
            btnStart.textContent = 'Resume'
            methods.pause?.(context)
          } else {
            running = true
            btnStart.textContent = 'Pause'
            methods.start?.(context)
          }
        })
      }

      if (btnStep) {
        btnStep.addEventListener('click', () => {
          if (running && btnStart) {
            running = false
            btnStart.textContent = 'Resume'
            methods.pause?.(context)
          }
          methods.step?.(context)
          methods.draw(context)
        })
      }

      if (btnReset) {
        btnReset.addEventListener('click', () => {
          running = false
          if (btnStart) btnStart.textContent = 'Start'
          methods.reset(context)
          methods.draw(context)
        })
      }

      // Initialize and draw
      methods.init?.(context)
      methods.draw(context)
    }, 0)

    return page
  }
}
