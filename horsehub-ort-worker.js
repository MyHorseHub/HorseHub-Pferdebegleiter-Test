/* HorseHub 1.27.3 worker entry.
 * flux-klein.js creates this worker as a MODULE worker. Module workers must
 * use import (not importScripts); importScripts() is only available to classic
 * workers. Keep this entry on the same origin as the GitHub Pages app, then
 * let the browser load the upstream module with CORS semantics. The runtime receives
 * an explicit ortUrl so the upstream worker does not need to resolve the npm
 * bare specifier `onnxruntime-web/wasm` itself.
 */
import 'https://cdn.jsdelivr.net/npm/flux-klein.js@0.6.0/src/ort-worker.js';
