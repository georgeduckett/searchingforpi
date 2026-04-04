// ─── Page Module Barrel Export ───────────────────────────────────────────────
// Re-exports all types and functions from the split page module files.
// This file maintains backward compatibility for existing imports.

// Re-export types and functions from split modules
export { createAnimationLoop, type AnimationOptions, type AnimationLoop } from './animation'
export {
  statCard,
  statsRow,
  statsProgressBar,
  updateStat,
  updateProgress,
  legend,
  legendItem,
  explanation,
} from './stats'

// Re-export everything from the page/ subdirectory
export {
  // Types
  type PageOptions,
  type PageContext,
  type PageMethods,
  type MethodPageOptions,
  type MethodPageContext,
  type MethodPageMethods,
  // Factories
  createPageFactory,
  createMethodPageFactory,
} from './page/index'
