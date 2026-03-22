import './style.css'
import { initRouter, registerPage } from './router'
import { createHomePage }       from './methods/home'
import { createMonteCarloPage } from './methods/monteCarlo'
import { createLeibnizPage }    from './methods/leibniz'
import { createBuffonPage }     from './methods/buffon'

// ─── Register pages ───────────────────────────────────────────────────────────
// Add a new line here whenever you create a new method file.
registerPage('home',        createHomePage)
registerPage('monte-carlo', createMonteCarloPage)
registerPage('leibniz',     createLeibnizPage)
registerPage('buffon',      createBuffonPage)

// ─── Boot the router ──────────────────────────────────────────────────────────
// This reads the current URL hash and renders the matching page.
initRouter()
