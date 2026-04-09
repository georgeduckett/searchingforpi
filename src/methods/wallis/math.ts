// ─── Wallis Product Mathematics ────────────────────────────────────────────────
// Mathematical functions for the Wallis product method.

// ─── Factor Calculation ───────────────────────────────────────────────────────

/**
 * Get the n-th factor value (1-indexed)
 * Odd factors: (2k+2)/(2k+1) > 1, where k = (n-1)/2
 * Even factors: (2k+2)/(2k+3) < 1, where k = (n-2)/2
 */
export function getFactor(n: number): number {
  const k = Math.floor((n - 1) / 2)
  if (n % 2 === 1) {
    // Odd factor: (2(k+1))/(2(k+1)-1) = (2k+2)/(2k+1)
    return (2 * (k + 1)) / (2 * (k + 1) - 1)
  } else {
    // Even factor: (2k+2)/(2k+3)
    return (2 * (k + 1)) / (2 * (k + 1) + 1)
  }
}

// ─── Pi Estimation ─────────────────────────────────────────────────────────────

/**
 * Estimate π from the product.
 * Formula: π = 2 × product
 */
export function estimatePi(product: number): number {
  return 2 * product
}

/**
 * Get the target value (π/2).
 */
export function getTarget(): number {
  return Math.PI / 2
}
