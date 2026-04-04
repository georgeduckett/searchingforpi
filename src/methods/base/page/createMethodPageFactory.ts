// ─── Method Page Factory ─────────────────────────────────────────────────────
// Creates a method page factory with the standard viz-layout structure.
// This is the two-column layout with canvas on left and stats/info on right.

import type { Page } from '../../../router'
import { queryRequired } from '../../../utils'
import type { MethodPageOptions, MethodPageContext, MethodPageMethods } from './types'

/**
 * Creates a method page factory with the standard viz-layout structure.
 * This is the two-column layout with canvas on left and stats/info on right.
 *
 * @example
 * ```ts
 * const createMyMethodPage = createMethodPageFactory<State>(
 *   {
 *     title: 'My Method',
 *     index: '01',
 *     statsPanel: `<div class="stat-card">...</div>`,
 *   },
 *   { count: 0 },
 *   {
 *     init(ctx) { /* wire up buttons *\/ },
 *     draw(ctx) { /* render canvas *\/ },
 *   }
 * )
 * ```
 */
export function createMethodPageFactory<S>(
  options: MethodPageOptions,
  initialState: S,
  methods: MethodPageMethods<S>
): () => Page {
  const {
    title,
    subtitle,
    index,
    canvasWidth = 560,
    canvasHeight = 560,
    controls = '<button class="btn primary" id="btn-start">Start</button><button class="btn" id="btn-step">Step</button><button class="btn" id="btn-reset" disabled>Reset</button>',
    statsPanel,
  } = options

  return function pageFactory(): Page {
    const state: S = JSON.parse(JSON.stringify(initialState))
    let animationId: number | null = null

    function render(): HTMLElement {
      const page = document.createElement('div')
      page.className = 'page'

      page.innerHTML = `
        <header class="page-header">
          ${index ? `<span class="page-index">Method ${index}</span>` : ''}
          <h2 class="page-title">${title}</h2>
          ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
        </header>

        <div class="viz-layout">
          <div>
            <div class="canvas-wrapper">
              <canvas id="canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
            </div>
            <div style="margin-top:14px" class="controls">
              ${controls}
            </div>
          </div>

          <div class="stats-panel">
            ${statsPanel}
          </div>
        </div>
      `

      return page
    }

    function cleanup(): void {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }

      const ctx: MethodPageContext<S> = {
        canvas: null as unknown as HTMLCanvasElement,
        ctx: null as unknown as CanvasRenderingContext2D,
        state,
        statsPanel: null as unknown as HTMLElement,
        $: () => null as unknown as HTMLElement,
        $required: () => null as unknown as HTMLElement,
        $id: () => null as unknown as HTMLElement as any,
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

      const statsPanelEl = queryRequired(document, '.stats-panel', HTMLElement)

      // Helper functions for querying elements
      const $ = (selector: string): HTMLElement =>
        document.querySelector(selector) as HTMLElement
      const $required = (selector: string): HTMLElement =>
        queryRequired(document, selector, HTMLElement)
      const $id = <T extends HTMLElement>(id: string, ctor: new () => T): T =>
        queryRequired(document, `#${id}`, ctor)

      const context: MethodPageContext<S> = {
        canvas,
        ctx: ctx2d,
        state,
        statsPanel: statsPanelEl,
        $,
        $required,
        $id,
      }

      // Initialize and draw
      methods.init?.(context)
      methods.draw?.(context)
    }, 0)

    return page
  }
}
