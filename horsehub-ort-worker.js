/* HorseHub 1.27.1 same-origin classic-worker shim.
 * Keep this file at the GitHub Pages root beside horse-companion-ai.js.
 * The upstream package worker is loaded as a classic worker script so the page
 * does not construct a Worker directly from the cross-origin CDN URL.
 */
importScripts('https://cdn.jsdelivr.net/npm/flux-klein.js@0.6.0/src/ort-worker.js');
