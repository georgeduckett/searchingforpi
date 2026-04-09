// ─── Riemann Integral Mathematics ──────────────────────────────────────────────
// Mathematical functions for the Riemann integral method.

// ─── The Function ──────────────────────────────────────────────────────────────

/**
 * The function: f(x) = 4/(1+x²)
 * Integral from 0 to 1 = π
 */
export function f(x: number): number {
  return 4 / (1 + x * x)
}

// ─── Riemann Sum ───────────────────────────────────────────────────────────────

/**
 * Compute Riemann sum for the current number of rectangles.
 */
export function computeSum(rects: number): number {
  if (rects === 0) return 0
  const n = rects
  const dx = 1 / n
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += f(i * dx) * dx
  }
  return sum
}
