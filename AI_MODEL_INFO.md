# Local AI model information

HorseHub 1.27.0 uses `flux-klein.js` 0.6.0 as an on-demand browser runtime and the `radames/flux2-klein-edge-web` browser weights by default.

The runtime uses WebGPU in the browser and supports image editing/reference images. Model weights are cached in browser origin-private storage; the first run requires an internet connection to obtain the model files.

Runtime documentation: https://socket.dev/npm/package/flux-klein.js/overview/0.6.0
Model weights: https://huggingface.co/radames/flux2-klein-edge-web

The `flux-klein.js` code is MIT-licensed. The FLUX.2 Klein weights are distributed separately under their upstream model license. Check the current model terms before redistributing the weights with a production app.


## Worker-Fix 1.27.1 (Test)

The browser previously attempted to construct the ONNX Runtime worker directly from jsDelivr, which fails on GitHub Pages due to the cross-origin Worker restriction. The test build now passes a same-origin `workerUrl` (`horsehub-ort-worker.js`) to the runtime. That local classic-worker shim imports the pinned upstream worker entry. This is a compatibility workaround to test in Chrome; verify on the target phone before relying on it in production.
