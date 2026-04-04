// ─── Page Module Barrel Export ───────────────────────────────────────────────
// Re-exports all types and functions from the page module.

// Types
export type {
  PageOptions,
  PageContext,
  PageMethods,
  MethodPageOptions,
  MethodPageContext,
  MethodPageMethods,
} from './types'

// Factories
export { createPageFactory } from './createPageFactory'
export { createMethodPageFactory } from './createMethodPageFactory'
