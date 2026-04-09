// ─── Monte Carlo Constants ────────────────────────────────────────────────────
// Configuration constants for the Monte Carlo method.

import { CANVAS_SIZE } from '../../colors'

// ─── Animation Constants ──────────────────────────────────────────────────────

/** Number of dots to add per animation tick */
export const DOTS_PER_TICK = 30

/** Maximum total dots before animation stops */
export const MAX_DOTS = 20_000

// ─── Visual Constants ──────────────────────────────────────────────────────────

/** Radius of each dot in pixels */
export const DOT_RADIUS = 1.2

/** Alpha transparency for dots */
export const DOT_ALPHA = 0.7

/** Radius of dots in preview */
export const PREVIEW_DOT_RADIUS = 1.5

/** Circle radius as factor of canvas size */
export const CIRCLE_RADIUS_FACTOR = 0.5

// ─── Derived Constants ─────────────────────────────────────────────────────────

/** Actual circle radius in pixels */
export const CIRCLE_RADIUS = CANVAS_SIZE * CIRCLE_RADIUS_FACTOR
