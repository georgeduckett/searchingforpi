// ─── Legend and Explanation Helpers ───────────────────────────────────────────
// Utilities for building legend and explanation sections.

/**
 * Creates HTML for a legend item.
 */
export function legendItem(color: string, text: string): string {
  return `<div class="legend-item"><div class="legend-dot" style="background:${color}"></div>${text}</div>`
}

/**
 * Creates HTML for a legend section from an array of items.
 */
export function legend(items: Array<{ color: string; text: string }>): string {
  return `<div class="legend">${items.map(i => legendItem(i.color, i.text)).join('')}</div>`
}

/**
 * Creates HTML for an explanation section.
 */
export function explanation(title: string, paragraphs: string[], formula?: string): string {
  let html = `<div class="explanation"><h3>${title}</h3>`
  for (const p of paragraphs) {
    html += `<p>${p}</p>`
  }
  if (formula) {
    html += `<div class="formula">${formula}</div>`
  }
  html += `</div>`
  return html
}
