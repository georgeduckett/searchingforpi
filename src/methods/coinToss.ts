import type { Page } from '../router'

// ─── Constants ───────────────────────────────────────────────────────────────
const CANVAS_W = 560
const CANVAS_H = 320
const SEQUENCES_PER_TICK = 10
const MAX_SEQUENCES = 10_000

// ─── Colours ─────────────────────────────────────────────────────────────────
const C_BG      = '#13161f'
const C_GRID    = '#1a1e2b'
const C_RATIO   = '#4a9eff'
const C_TARGET  = '#c8922a'
const C_TEXT    = '#4a5068'

// ─── State ───────────────────────────────────────────────────────────────────
interface Sequence {
  heads: number
  total: number
  ratio: number
}

interface State {
  sequences: Sequence[]
  sumRatios: number
  running: boolean
  rafId: number | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function simulateSequence(): Sequence {
  let heads = 0
  let total = 0
  while (heads <= total - heads) {
    total++
    if (Math.random() < 0.5) heads++
  }
  const ratio = heads / total
  return { heads, total, ratio }
}

function estimatePi(sumRatios: number, numSequences: number): number {
  if (numSequences === 0) return 0
  const avgRatio = sumRatios / numSequences
  return 4 * avgRatio
}

function fmt(n: number, digits = 6): string {
  return n.toFixed(digits)
}

// ─── Page Factory ─────────────────────────────────────────────────────────────
export function createCoinTossPage(): Page {
  const state: State = { sequences: [], sumRatios: 0, running: false, rafId: null }
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let btnStart: HTMLButtonElement
  let btnStep: HTMLButtonElement
  let btnReset: HTMLButtonElement
  let elEstimate: HTMLElement
  let elSequences: HTMLElement
  let elAvgRatio: HTMLElement
  let elError: HTMLElement
  let elBar: HTMLElement

  // ── Draw ───────────────────────────────────────────────────────────────────
  function draw(): void {
    ctx.fillStyle = C_BG
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    const n = state.sequences.length
    if (n === 0) return

    // Draw grid
    ctx.strokeStyle = C_GRID
    ctx.lineWidth = 1
    for (let x = 0; x <= CANVAS_W; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, CANVAS_H)
      ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_W, y)
      ctx.stroke()
    }

    // Draw ratios as points
    ctx.fillStyle = C_RATIO
    const maxSeq = Math.min(n, 200) // show last 200
    const startIdx = Math.max(0, n - maxSeq)
    for (let i = 0; i < maxSeq; i++) {
      const seq = state.sequences[startIdx + i]
      const x = (i / maxSeq) * CANVAS_W
      const y = CANVAS_H - (seq.ratio * CANVAS_H)
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Target line at pi/4
    const targetY = CANVAS_H - ((Math.PI / 4) * CANVAS_H)
    ctx.strokeStyle = C_TARGET
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, targetY)
    ctx.lineTo(CANVAS_W, targetY)
    ctx.stroke()

    // Labels
    ctx.fillStyle = C_TEXT
    ctx.font = '12px monospace'
    ctx.fillText('π/4 target', 10, targetY - 5)
  }

  // ── Add sequences ──────────────────────────────────────────────────────────
  function addSequences(count: number): void {
    for (let i = 0; i < count; i++) {
      const seq = simulateSequence()
      state.sequences.push(seq)
      state.sumRatios += seq.ratio
    }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  function updateStats(): void {
    const n = state.sequences.length
    const pi = estimatePi(state.sumRatios, n)
    const avgRatio = n > 0 ? state.sumRatios / n : 0

    elEstimate.textContent = fmt(pi)
    elSequences.textContent = n.toLocaleString()
    elAvgRatio.textContent = fmt(avgRatio)
    elError.textContent = Math.abs(pi - Math.PI).toFixed(6)
    elBar.style.width = `${Math.min((n / MAX_SEQUENCES) * 100, 100)}%`

    draw()
  }

  // ── Animation ──────────────────────────────────────────────────────────────
  function tick(): void {
    if (!state.running) return
    if (state.sequences.length >= MAX_SEQUENCES) {
      stop()
      btnStart.textContent = 'Done'
      btnStart.disabled = true
      return
    }
    const batch = Math.min(SEQUENCES_PER_TICK, MAX_SEQUENCES - state.sequences.length)
    addSequences(batch)
    updateStats()
    state.rafId = requestAnimationFrame(tick)
  }

  function start(): void {
    state.running = true
    btnStart.disabled = true
    btnStart.textContent = 'Running…'
    btnReset.disabled = false
    btnStep.disabled = false
    state.rafId = requestAnimationFrame(tick)
  }

  function stop(): void {
    state.running = false
    if (state.rafId !== null) cancelAnimationFrame(state.rafId)
  }

  function reset(): void {
    stop()
    state.sequences = []
    state.sumRatios = 0
    draw()
    updateStats()
    btnStart.textContent = 'Start'
    btnStart.disabled = false
    btnStep.disabled = false
    btnReset.disabled = true
  }

  // ── Build DOM ─────────────────────────────────────────────────────────────
  function render(): HTMLElement {
    const page = document.createElement('div')
    page.className = 'page'

    page.innerHTML = `
      <header class="page-header">
        <span class="page-index">Method 04</span>
        <h2 class="page-title">Coin Toss Sequences</h2>
        <p class="page-subtitle">
          Toss coins until heads exceed tails — the ratio reveals π/4.
        </p>
      </header>

      <div class="viz-layout">
        <!-- Canvas -->
        <div>
          <div class="canvas-wrapper">
            <canvas id="ct-canvas" width="${CANVAS_W}" height="${CANVAS_H}"></canvas>
          </div>
          <div style="margin-top:14px" class="controls">
            <button id="ct-start" class="btn primary">Start</button>
            <button id="ct-step"  class="btn">Add 10</button>
            <button id="ct-reset" class="btn" disabled>Reset</button>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-panel">
          <div class="stat-card">
            <div class="stat-label">π estimate</div>
            <div class="stat-value large" id="ct-estimate">0.000000</div>
            <div class="stat-error neutral" id="ct-error">—</div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" id="ct-bar" style="width:0%"></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Sequences completed</div>
            <div class="stat-value" id="ct-sequences">0</div>
            <div class="stat-sub">of ${MAX_SEQUENCES.toLocaleString()} max</div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Average heads/total ratio</div>
            <div class="stat-value" id="ct-avg-ratio">0.000000</div>
          </div>

          <div class="explanation">
            <h3>The Coin Toss Method</h3>
            <p>
              For each sequence: toss a coin repeatedly until the number of heads
              exceeds the number of tails. Record the ratio of heads to total tosses.
            </p>
            <div class="formula">π/4 ≈ average(heads/total)</div>
            <p>
              Surprisingly, this ratio converges to π/4. The expected number of
              tosses until heads exceed tails is π²/8, but the ratio of heads
              to total flips approaches π/4.
            </p>
            <p>
              Use <em>Add 10</em> to run 10 sequences at a time, or <em>Start</em>
              to run continuously.
            </p>
          </div>
        </div>
      </div>
    `

    canvas      = page.querySelector<HTMLCanvasElement>('#ct-canvas')!
    btnStart    = page.querySelector<HTMLButtonElement>('#ct-start')!
    btnStep     = page.querySelector<HTMLButtonElement>('#ct-step')!
    btnReset    = page.querySelector<HTMLButtonElement>('#ct-reset')!
    elEstimate  = page.querySelector('#ct-estimate')!
    elSequences = page.querySelector('#ct-sequences')!
    elAvgRatio  = page.querySelector('#ct-avg-ratio')!
    elError     = page.querySelector('#ct-error')!
    elBar       = page.querySelector<HTMLElement>('#ct-bar')!

    ctx = canvas.getContext('2d')!
    draw()

    btnStart.addEventListener('click', () => {
      if (state.sequences.length >= MAX_SEQUENCES) reset()
      start()
    })
    btnStep.addEventListener('click', () => {
      if (!state.running) {
        addSequences(10)
        updateStats()
        btnReset.disabled = false
      }
    })
    btnReset.addEventListener('click', reset)

    return page
  }

  function cleanup(): void {
    stop()
  }

  return { render, cleanup }
}