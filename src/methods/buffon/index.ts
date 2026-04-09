// ─── Buffon's Needle Method Barrel Export ──────────────────────────────────────
// Re-exports all buffon method components.

export type { State, Needle } from './types'
export { createInitialState, NEEDLE_LENGTH, LINE_SPACING, CANVAS_W, CANVAS_H } from './types'
export { createBuffonController, type StatsElements } from './controller'
export { createBuffonPage } from './page'
export { drawPreview } from './preview'
export { drawBackground, drawNeedle } from './rendering'
export { estimatePi, doesCross, generateRandomNeedle, type NeedleParams } from './physics'
