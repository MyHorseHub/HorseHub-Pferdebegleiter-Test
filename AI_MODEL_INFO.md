# Local AI model information

HorseHub 1.28.0 uses `flux-klein.js` 0.6.0 as an on-demand browser runtime and the `radames/flux2-klein-edge-web` browser weights by default.

The runtime uses WebGPU in the browser and supports image editing/reference images. Model weights are cached in browser origin-private storage; the first run requires an internet connection to obtain the model files.

Runtime documentation: https://socket.dev/npm/package/flux-klein.js/overview/0.6.0
Model weights: https://huggingface.co/radames/flux2-klein-edge-web

The `flux-klein.js` code is MIT-licensed. The FLUX.2 Klein weights are distributed separately under their upstream model license. Check the current model terms before redistributing the weights with a production app.


## Worker-Fix 1.27.1 (historischer Testschritt)

The browser previously attempted to construct the ONNX Runtime worker directly from jsDelivr, which fails on GitHub Pages due to the cross-origin Worker restriction. The test build now passes a same-origin `workerUrl` (`horsehub-ort-worker.js`) to the runtime. That local classic-worker shim imports the pinned upstream worker entry. This is a compatibility workaround to test in Chrome; verify on the target phone before relying on it in production.


## Worker note for 1.27.2 (historischer Testschritt)

The local worker entry is a module worker and therefore uses an ES module `import`, not `importScripts()`. This corrects the exact error seen in 1.27.1. Upstream module loading still depends on CDN availability and CORS headers.


## Version 1.27.3 – explicit ONNX Runtime URL (Basis der stabilen Integration)
The previous error `Failed to resolve module specifier 'onnxruntime-web/wasm'` was caused by a browser worker receiving an npm bare module specifier. 1.27.3 passes an explicit browser URL for ONNX Runtime Web (1.30.0) via `ortUrl` and the corresponding `dist/` path via `wasmPaths`. ONNX Runtime documents both the browser import and explicit WASM asset path configuration. The ORT version is pinned for reproducible testing; it can be changed after compatibility is confirmed.


## HorseHub 1.28.0 – integration
The successful 384×384 / 4-step / tiny-decoder configuration is now the normal companion mode. The main app loads the AI engine only when the user explicitly starts `3D-Begleiter erstellen`. Companion images are stored per horse in IndexedDB (`HorseHubCompanionDB_v2`) with a limited LocalStorage fallback. The AI module supports `persist:false` so the integrated app can own per-horse storage while the isolated lab can still keep its own test result.

512×512 remains experimental because the target Android device repeatedly reported `GPUBuffer: [Device] is lost` at 512×512. The production companion path therefore does not use the full decoder.
