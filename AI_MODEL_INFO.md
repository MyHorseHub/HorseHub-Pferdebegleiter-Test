# Local AI model information

HorseHub 1.27.0 uses `flux-klein.js` 0.6.0 as an on-demand browser runtime and the `radames/flux2-klein-edge-web` browser weights by default.

The runtime uses WebGPU in the browser and supports image editing/reference images. Model weights are cached in browser origin-private storage; the first run requires an internet connection to obtain the model files.

Runtime documentation: https://socket.dev/npm/package/flux-klein.js/overview/0.6.0
Model weights: https://huggingface.co/radames/flux2-klein-edge-web

The `flux-klein.js` code is MIT-licensed. The FLUX.2 Klein weights are distributed separately under their upstream model license. Check the current model terms before redistributing the weights with a production app.


## Worker-Fix 1.27.1 (Test)

The browser previously attempted to construct the ONNX Runtime worker directly from jsDelivr, which fails on GitHub Pages due to the cross-origin Worker restriction. The test build now passes a same-origin `workerUrl` (`horsehub-ort-worker.js`) to the runtime. That local classic-worker shim imports the pinned upstream worker entry. This is a compatibility workaround to test in Chrome; verify on the target phone before relying on it in production.


## Worker note for 1.27.2

The local worker entry is a module worker and therefore uses an ES module `import`, not `importScripts()`. This corrects the exact error seen in 1.27.1. Upstream module loading still depends on CDN availability and CORS headers.


## Version 1.27.3 – explicit ONNX Runtime URL
The previous error `Failed to resolve module specifier 'onnxruntime-web/wasm'` was caused by a browser worker receiving an npm bare module specifier. 1.27.3 passes an explicit browser URL for ONNX Runtime Web (1.30.0) via `ortUrl` and the corresponding `dist/` path via `wasmPaths`. ONNX Runtime documents both the browser import and explicit WASM asset path configuration. The ORT version is pinned for reproducible testing; it can be changed after compatibility is confirmed.
