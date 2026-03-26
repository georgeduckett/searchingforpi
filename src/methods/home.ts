import type { Page } from '../router'
import { methodPages } from '../pages'
import { C_BG, C_INSIDE, C_OUTSIDE, C_AMBER, C_AMBER_BRIGHT, C_BORDER, C_TEXT_MUTED } from '../colors'

// ─── Constants ───────────────────────────────────────────────────────────────
const PREVIEW_SIZE = 140

// ─── Preview Renderers ───────────────────────────────────────────────────────
type PreviewRenderer = (ctx: CanvasRenderingContext2D, time: number) => void

function drawMonteCarloPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Circle outline
  ctx.strokeStyle = C_AMBER
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(s / 2, s / 2, s / 2 - 4, 0, Math.PI * 2)
  ctx.stroke()

  // Dots with stable pseudo-random positions
  for (let i = 0; i < 60; i++) {
    // Use sin/cos to generate stable "random" positions
    const x = 4 + (Math.sin(i * 1.1) * 0.5 + 0.5) * (s - 8)
    const y = 4 + (Math.cos(i * 1.3) * 0.5 + 0.5) * (s - 8)
    const r = s / 2 - 4
    const dx = x - s / 2
    const dy = y - s / 2
    const inside = dx * dx + dy * dy <= r * r
    ctx.fillStyle = inside ? C_INSIDE : C_OUTSIDE
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.arc(x, y, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawLeibnizPreview(ctx: CanvasRenderingContext2D, time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Alternating bars representing the series
  const terms = 10
  const barW = (s - 20) / terms
  let sum = 0
  for (let i = 0; i < terms; i++) {
    const sign = i % 2 === 0 ? 1 : -1
    const term = sign / (2 * i + 1)
    sum += term
    const h = Math.abs(term) * (s - 30) * 2
    ctx.fillStyle = i % 2 === 0 ? C_INSIDE : C_OUTSIDE
    ctx.globalAlpha = 0.7 + 0.15 * Math.sin(time * 0.5 + i * 0.3)
    ctx.fillRect(10 + i * barW, s / 2 - h / 2, barW - 2, h)
  }
  ctx.globalAlpha = 1

  // Pi/4 line
  const pi4 = (s - 30) * (Math.PI / 4)
  ctx.strokeStyle = C_AMBER
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(10, s / 2 - pi4 / 2)
  ctx.lineTo(s - 10, s / 2 - pi4 / 2)
  ctx.stroke()
}

function drawBuffonPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Horizontal lines
  ctx.strokeStyle = C_BORDER
  ctx.lineWidth = 1
  for (let y = 20; y < s; y += 25) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(s, y)
    ctx.stroke()
  }

  // Needles with stable pseudo-random positions
  for (let i = 0; i < 12; i++) {
    const cx = (Math.sin(i * 2.1) * 0.5 + 0.5) * s
    const cy = 10 + (Math.cos(i * 1.7) * 0.5 + 0.5) * (s - 20)
    const angle = (Math.sin(i * 3.3) * 0.5 + 0.5) * Math.PI
    const len = 20
    const dx = (len / 2) * Math.cos(angle)
    const dy = (len / 2) * Math.sin(angle)
    const crosses = Math.floor(cy / 25) !== Math.floor((cy + dy) / 25) || Math.floor(cy / 25) !== Math.floor((cy - dy) / 25)
    ctx.strokeStyle = crosses ? C_AMBER : C_TEXT_MUTED
    ctx.lineWidth = crosses ? 1.5 : 1
    ctx.globalAlpha = crosses ? 1 : 0.5
    ctx.beginPath()
    ctx.moveTo(cx - dx, cy - dy)
    ctx.lineTo(cx + dx, cy + dy)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawCoinTossPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Coins representation with stable positions
  for (let i = 0; i < 8; i++) {
    const x = 15 + (i % 4) * 30
    const y = 25 + Math.floor(i / 4) * 50
    const heads = Math.sin(i * 5.7) > 0
    ctx.fillStyle = heads ? C_INSIDE : C_OUTSIDE
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = C_BG
    ctx.font = 'bold 10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(heads ? 'H' : 'T', x, y + 4)
  }
}

function drawBouncingBoxesPreview(ctx: CanvasRenderingContext2D, time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Wall
  ctx.strokeStyle = C_TEXT_MUTED
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(10, 0)
  ctx.lineTo(10, s)
  ctx.stroke()

  // Small box bouncing
  const x1 = 25 + Math.abs(Math.sin(time * 0.8)) * 40
  ctx.fillStyle = C_INSIDE
  ctx.fillRect(x1, s / 2 - 10, 20, 20)

  // Large box
  const x2 = 80 + Math.abs(Math.sin(time * 0.6)) * 30
  ctx.fillStyle = C_AMBER
  ctx.fillRect(x2, s / 2 - 10, 20, 20)
}

function drawArchimedesPreview(ctx: CanvasRenderingContext2D, time: number): void {
  const s = PREVIEW_SIZE
  const cx = s / 2
  const cy = s / 2
  const r = s / 2 - 10

  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Inscribed polygon - cycle through 6, 8, 10, 12 sides slowly
  const sides = 6 + Math.floor(time * 0.2) % 4 * 2
  ctx.strokeStyle = C_INSIDE
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Circumscribed polygon
  const r2 = r / Math.cos(Math.PI / sides)
  ctx.strokeStyle = C_OUTSIDE
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const x = cx + r2 * Math.cos(angle)
    const y = cy + r2 * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Circle
  ctx.strokeStyle = C_AMBER
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
}

function drawDrawCirclePreview(ctx: CanvasRenderingContext2D, time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Animate a "drawing" circle - takes 4 seconds to complete
  const progress = (time * 0.25) % 1
  const r = s / 2 - 15
  ctx.strokeStyle = C_AMBER
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(s / 2, s / 2, r, 0, progress * Math.PI * 2)
  ctx.stroke()

  // Pencil indicator
  const angle = progress * Math.PI * 2
  ctx.fillStyle = C_AMBER_BRIGHT
  ctx.beginPath()
  ctx.arc(s / 2 + r * Math.cos(angle), s / 2 + r * Math.sin(angle), 4, 0, Math.PI * 2)
  ctx.fill()

  // π = C/d label
  ctx.fillStyle = C_TEXT_MUTED
  ctx.font = '12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('π = C/d', s / 2, s - 8)
}

function drawRiemannPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Curve y = 4/(1+x²)
  ctx.strokeStyle = C_AMBER
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let x = 0; x <= s - 10; x++) {
    const nx = x / (s - 10)
    const y = 4 / (1 + nx * nx)
    const py = s - 10 - (y / 4) * (s - 20)
    if (x === 0) ctx.moveTo(x + 10, py)
    else ctx.lineTo(x + 10, py)
  }
  ctx.stroke()

  // Riemann rectangles
  ctx.fillStyle = C_INSIDE
  ctx.globalAlpha = 0.5
  const n = 8
  for (let i = 0; i < n; i++) {
    const x0 = 10 + (i / n) * (s - 20)
    const w = (s - 20) / n
    const nx = i / n
    const y = 4 / (1 + nx * nx)
    const h = (y / 4) * (s - 20)
    ctx.fillRect(x0, s - 10 - h, w - 1, h)
  }
  ctx.globalAlpha = 1
}

function drawBaselPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Stacking squares of area 1/n²
  let y = s - 10
  ctx.fillStyle = C_INSIDE
  for (let n = 1; n <= 6; n++) {
    const size = Math.sqrt(1 / (n * n)) * (s - 20)
    const x = (s - size) / 2
    ctx.globalAlpha = 1 - n * 0.1
    ctx.fillRect(x, y - size, size, size)
    y -= size + 2
  }
  ctx.globalAlpha = 1

  // π²/6 label
  ctx.fillStyle = C_AMBER
  ctx.font = '11px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('Σ 1/n² = π²/6', s / 2, 15)
}

function drawWallisPreview(ctx: CanvasRenderingContext2D, time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Oscillating product visualization
  const terms = 6
  const barW = (s - 20) / terms
  for (let i = 0; i < terms; i++) {
    const n = i + 1
    const val = (2 * n) / (2 * n - 1) * (2 * n) / (2 * n + 1)
    const h = val * 20 + Math.sin(time * 0.6 + i * 0.5) * 5
    ctx.fillStyle = i % 2 === 0 ? C_INSIDE : C_AMBER
    ctx.globalAlpha = 0.7
    ctx.fillRect(10 + i * barW, s / 2 - h, barW - 3, h * 2)
  }
  ctx.globalAlpha = 1

  // Product approaching π/2
  ctx.fillStyle = C_AMBER
  ctx.font = '11px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('→ π/2', s / 2, 15)
}

function drawCoprimalityPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Grid of pairs, colored by coprimality
  const n = 10
  const cell = (s - 20) / n
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
      const isCoprime = gcd(i, j) === 1
      ctx.fillStyle = isCoprime ? C_INSIDE : C_TEXT_MUTED
      ctx.globalAlpha = isCoprime ? 0.8 : 0.2
      ctx.fillRect(10 + (i - 1) * cell, 10 + (j - 1) * cell, cell - 1, cell - 1)
    }
  }
  ctx.globalAlpha = 1

  // 6/π² label
  ctx.fillStyle = C_AMBER
  ctx.font = '10px monospace'
  ctx.textAlign = 'right'
  ctx.fillText('P = 6/π²', s - 10, s - 5)
}

function drawGaltonPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Pegs in triangle
  ctx.fillStyle = C_TEXT_MUTED
  const rows = 5
  for (let row = 0; row < rows; row++) {
    for (let peg = 0; peg <= row; peg++) {
      const x = s / 2 + (peg - row / 2) * 16
      const y = 20 + row * 18
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Balls at bottom (binomial distribution)
  ctx.fillStyle = C_INSIDE
  const bins = [2, 4, 6, 4, 2] // Approximate binomial
  const maxH = 30
  for (let i = 0; i < 5; i++) {
    const h = (bins[i] / 6) * maxH
    ctx.fillRect(s / 2 + (i - 2) * 16 - 6, s - 15 - h, 12, h)
  }

  // Gaussian curve hint
  ctx.strokeStyle = C_AMBER
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(s / 2 - 40, s - 15)
  ctx.quadraticCurveTo(s / 2, s - 55, s / 2 + 40, s - 15)
  ctx.stroke()
}

function drawCirclePackingPreview(ctx: CanvasRenderingContext2D, _time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Packed circles with stable positions
  for (let i = 0; i < 20; i++) {
    const x = 15 + (Math.sin(i * 2.3) * 0.5 + 0.5) * (s - 30)
    const y = 15 + (Math.cos(i * 1.9) * 0.5 + 0.5) * (s - 30)
    const r = 5 + (Math.sin(i * 3.1) * 0.5 + 0.5) * 12
    ctx.strokeStyle = C_INSIDE
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = C_INSIDE
    ctx.globalAlpha = 0.2
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawGasMoleculesPreview(ctx: CanvasRenderingContext2D, time: number): void {
  const s = PREVIEW_SIZE
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, s, s)

  // Container border
  ctx.strokeStyle = C_BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(5, 5, s - 10, s - 10)

  // Molecules moving - much slower movement
  ctx.fillStyle = C_INSIDE
  for (let i = 0; i < 15; i++) {
    const angle = time * 0.5 + i * 0.7
    const speed = 0.3 + (i % 3) * 0.15
    const x = 15 + Math.sin(angle * speed + i) * 50 + (i % 5) * 22
    const y = 15 + Math.cos(angle * speed * 0.7 + i * 2) * 50 + Math.floor(i / 5) * 35
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.arc(Math.min(s - 15, Math.max(15, x)), Math.min(s - 15, Math.max(15, y)), 4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// ─── Preview Registry ────────────────────────────────────────────────────────
const previewRenderers: Record<string, PreviewRenderer> = {
  'monte-carlo': drawMonteCarloPreview,
  'leibniz': drawLeibnizPreview,
  'buffon': drawBuffonPreview,
  'coin-toss': drawCoinTossPreview,
  'bouncing-boxes': drawBouncingBoxesPreview,
  'archimedes': drawArchimedesPreview,
  'draw-circle': drawDrawCirclePreview,
  'riemann': drawRiemannPreview,
  'basel': drawBaselPreview,
  'wallis': drawWallisPreview,
  'coprimality': drawCoprimalityPreview,
  'galton': drawGaltonPreview,
  'circle-packing': drawCirclePackingPreview,
  'gas-molecules': drawGasMoleculesPreview,
}

// ─── Page ───────────────────────────────────────────────────────────────────
export function createHomePage(): Page {
  let animationId: number | null = null
  let startTime: number = 0
  const canvases: Map<string, HTMLCanvasElement> = new Map()

  function animate(timestamp: number): void {
    const elapsed = (timestamp - startTime) / 1000

    canvases.forEach((canvas, hash) => {
      const renderer = previewRenderers[hash]
      if (renderer) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          renderer(ctx, elapsed)
        }
      }
    })

    animationId = requestAnimationFrame(animate)
  }

  function render(): HTMLElement {
    const page = document.createElement('div')
    page.className = 'page'

    page.innerHTML = `
      <header class="page-header">
        <span class="page-index">π — The Constant</span>
        <h2 class="page-title">Many Roads to Pi</h2>
        <p class="page-subtitle">
          π is irrational, transcendental, and ubiquitous. Here are several ways
          to calculate it — each illuminating a different corner of mathematics.
          Choose a method to explore.
        </p>
      </header>

      <div class="home-grid">
        ${methodPages
          .map(
            m => `
          <a class="method-card" href="#${m.hash}" data-page="${m.hash}">
            <div class="method-card-preview">
              <canvas class="preview-canvas" data-method="${m.hash}" width="${PREVIEW_SIZE}" height="${PREVIEW_SIZE}"></canvas>
            </div>
            <div class="method-card-content">
              <div class="method-card-index">${m.index}</div>
              <div class="method-card-title">${m.title}</div>
              <p class="method-card-desc">${m.desc}</p>
            </div>
          </a>
        `
          )
          .join('')}
      </div>
    `

    // Collect canvas references and start animation
    requestAnimationFrame(() => {
      page.querySelectorAll('.preview-canvas').forEach(canvas => {
        const el = canvas as HTMLCanvasElement
        const method = el.dataset['method']
        if (method) {
          canvases.set(method, el)
        }
      })

      startTime = performance.now()
      animationId = requestAnimationFrame(animate)
    })

    return page
  }

  function cleanup(): void {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    canvases.clear()
  }

  return { render, cleanup }
}
