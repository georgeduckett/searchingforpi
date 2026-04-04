// ─── Page Type Definitions ───────────────────────────────────────────────────
// All type definitions for page factories and contexts.

// ─── Simple Page Types ────────────────────────────────────────────────────────

export interface PageOptions {
  /** Title displayed in the header */
  title: string
  /** Subtitle/description */
  subtitle?: string
  /** Index label (e.g., "01", "Method") */
  index?: string
  /** Canvas width (default: 560) */
  canvasWidth?: number
  /** Canvas height (default: 560) */
  canvasHeight?: number
  /** Whether to show start/pause button (default: true) */
  hasStartPause?: boolean
  /** Whether to show step button (default: true) */
  hasStep?: boolean
  /** Whether to show reset button (default: true) */
  hasReset?: boolean
  /** Additional control buttons HTML */
  extraControls?: string
  /** Additional stats elements HTML */
  extraStats?: string
}

export interface PageContext<S> {
  /** The canvas element */
  canvas: HTMLCanvasElement
  /** The 2D rendering context */
  ctx: CanvasRenderingContext2D
  /** Start/pause button (if hasStartPause is true) */
  btnStart: HTMLButtonElement | null
  /** Step button (if hasStep is true) */
  btnStep: HTMLButtonElement | null
  /** Reset button (if hasReset is true) */
  btnReset: HTMLButtonElement | null
  /** The page state */
  state: S
  /** Stats container element */
  statsContainer: HTMLElement
}

export interface PageMethods<S> {
  /** Called once to initialize the page after DOM is ready */
  init?(ctx: PageContext<S>): void
  /** Draw the current state to the canvas */
  draw(ctx: PageContext<S>): void
  /** Start/resume the animation */
  start?(ctx: PageContext<S>): void
  /** Pause the animation */
  pause?(ctx: PageContext<S>): void
  /** Perform a single step */
  step?(ctx: PageContext<S>): void
  /** Reset to initial state */
  reset(ctx: PageContext<S>): void
  /** Cleanup when page is destroyed */
  cleanup?(ctx: PageContext<S>): void
}

// ─── Method Page Types ────────────────────────────────────────────────────────

export interface MethodPageOptions {
  /** Title displayed in the header */
  title: string
  /** Subtitle/description */
  subtitle?: string
  /** Index label (e.g., "01") */
  index?: string
  /** Canvas width (default: 560) */
  canvasWidth?: number
  /** Canvas height (default: 560) */
  canvasHeight?: number
  /** Custom controls HTML (replaces default buttons) */
  controls?: string
  /** Stats panel content HTML */
  statsPanel: string
}

export interface MethodPageContext<S> {
  /** The canvas element */
  canvas: HTMLCanvasElement
  /** The 2D rendering context */
  ctx: CanvasRenderingContext2D
  /** The page state */
  state: S
  /** Stats panel element */
  statsPanel: HTMLElement
  /** Query an element within the page by selector */
  $(selector: string): HTMLElement
  /** Query a required element within the page, throws if not found */
  $required(selector: string): HTMLElement
  /** Query a required element by ID */
  $id<T extends HTMLElement>(id: string, ctor: new () => T): T
}

export interface MethodPageMethods<S> {
  /** Called once to initialize the page after DOM is ready */
  init?(ctx: MethodPageContext<S>): void
  /** Draw the current state to the canvas */
  draw?(ctx: MethodPageContext<S>): void
  /** Start/resume the animation */
  start?(ctx: MethodPageContext<S>): void
  /** Pause the animation */
  pause?(ctx: MethodPageContext<S>): void
  /** Perform a single step */
  step?(ctx: MethodPageContext<S>): void
  /** Reset to initial state */
  reset?(ctx: MethodPageContext<S>): void
  /** Cleanup when page is destroyed */
  cleanup?(ctx: MethodPageContext<S>): void
}
