// ─── Page Factory Registry ────────────────────────────────────────────────────
// Central registry of all page factories, mapping hash keys to their creators.

import type { PageFactory } from '../../router'

// Import all page factories
import { createHomePage } from '../home'
import { createMonteCarloPage } from '../monteCarlo'
import { createLeibnizPage } from '../leibniz'
import { createBuffonPage } from '../buffon'
import { createCoinTossPage } from '../coinToss'
import { createBouncingBoxesPage } from '../bouncingBoxes'
import { createArchimedesPage } from '../archimedes'
import { createDrawCirclePage } from '../drawCircle'
import { createGasMoleculesPage } from '../gasMolecules'
import { createRiemannPage } from '../riemann'
import { createBaselPage } from '../basel'
import { createWallisPage } from '../wallis'
import { createCoprimalityPage } from '../coprimality'
import { createGaltonPage } from '../galton'
import { createCirclePackingPage } from '../circlePacking'

/**
 * Registry mapping page hash keys to their factory functions.
 * Used by the router to create pages on demand.
 */
export const pageFactories: Record<string, PageFactory> = {
  home: createHomePage,
  'monte-carlo': createMonteCarloPage,
  leibniz: createLeibnizPage,
  buffon: createBuffonPage,
  'coin-toss': createCoinTossPage,
  'bouncing-boxes': createBouncingBoxesPage,
  archimedes: createArchimedesPage,
  'draw-circle': createDrawCirclePage,
  'gas-molecules': createGasMoleculesPage,
  riemann: createRiemannPage,
  basel: createBaselPage,
  wallis: createWallisPage,
  coprimality: createCoprimalityPage,
  galton: createGaltonPage,
  'circle-packing': createCirclePackingPage,
}
