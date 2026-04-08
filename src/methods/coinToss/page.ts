// ─── Coin Toss Page ──────────────────────────────────────────────────────────
// Main page factory for the coin toss method.

import { createMethodPageFactory, statCard, explanation, cleanupController } from '../base/page'
import { State, MAX_SEQUENCES, createInitialState } from './types'
import { createCoinTossController, StatsElements } from './controller'

// ─── Page Factory ─────────────────────────────────────────────────────────────
export const createCoinTossPage = createMethodPageFactory<State>(
  {
    title: 'Coin Toss Sequences',
    subtitle: 'Toss coins until heads exceed tails — the ratio reveals π/4.',
    index: '04',
    canvasWidth: 560,
    canvasHeight: 320,
    controls: `
      <button id="ct-start" class="btn primary">Start</button>
      <button id="ct-step" class="btn">Show</button>
      <button id="ct-reset" class="btn" disabled>Reset</button>
    `,
    statsPanel: `
      ${statCard('π estimate', 'ct-estimate', { valueClass: 'stat-value large', errorId: 'ct-error', progressId: 'ct-bar' })}
      ${statCard('Sequences completed', 'ct-sequences', { subtext: `of ${MAX_SEQUENCES.toLocaleString()} max` })}
      ${statCard('Average heads/total ratio', 'ct-avg-ratio')}
      ${explanation(
        'The Coin Toss Method',
        [
          'For each sequence: toss a coin repeatedly until the number of heads exceeds the number of tails. Record the ratio of heads to total tosses.',
          'Surprisingly, this ratio converges to π/4. The expected number of tosses until heads exceed tails is π²/8, but the ratio of heads to total flips approaches π/4.',
          'Press <em>Start</em> to watch sequences build step-by-step, or use <em>Show</em> to add individual sequences instantly.',
        ],
        'π/4 ≈ average(heads/total)'
      )}
    `,
  },
  createInitialState(),
  {
    init(ctx) {
      const { $required } = ctx

      // Get stats element references
      const statsElements: StatsElements = {
        estimate: $required('#ct-estimate'),
        sequences: $required('#ct-sequences'),
        avgRatio: $required('#ct-avg-ratio'),
        error: $required('#ct-error'),
        bar: $required('#ct-bar'),
      }

      // Create and store the controller
      const controller = createCoinTossController(ctx, statsElements)

      // Store controller for cleanup
      ctx.state._controller = controller
    },

    draw(_ctx) {
      // Drawing is handled in init and animation loop
    },

    cleanup(ctx) {
      cleanupController(ctx.state)
    },
  }
)
