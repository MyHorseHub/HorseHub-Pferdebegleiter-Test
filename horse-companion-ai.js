/* HorseHub 1.27.2 – local AI lab engine.
 * The actual inference runs in the browser. This module only loads the
 * WebGPU runtime on demand, when the user starts a generation.
 */
(() => {
  'use strict';

  const AI_KEY = 'hhCompanionPhotoAI_v1';
  const AI_META_KEY = 'hhCompanionPhotoAIMeta_v1';
  const MODULE_URL = 'https://cdn.jsdelivr.net/npm/flux-klein.js@0.6.0/+esm';
  // Serve the Worker entry from this GitHub Pages origin. Direct cross-origin
  // Worker construction from jsDelivr is blocked by browsers. The local shim
  // imports the upstream ORT worker as a classic worker script.
  const MODEL_BASE = 'https://huggingface.co/radames/flux2-klein-edge-web/resolve/main';

  let engine = null;
  let loading = null;

  function setStatus(text) {
    try { window.dispatchEvent(new CustomEvent('hh-ai-status', { detail: String(text || '') })); } catch (_) {}
  }

  function imageDataToJpeg(imageData, quality = 0.92) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas-Kontext fehlt.');
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', quality);
  }

  function dataUrlToBlob(dataUrl) {
    const [meta, body] = dataUrl.split(',');
    if (!meta || !body) throw new Error('Ungültiges Bildformat.');
    const mime = /data:([^;]+);/i.exec(meta)?.[1] || 'image/jpeg';
    const bin = atob(body);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  async function loadBitmap(dataUrl) {
    if ('createImageBitmap' in window) return createImageBitmap(dataUrlToBlob(dataUrl));
    const img = new Image();
    img.decoding = 'async';
    img.src = dataUrl;
    await img.decode();
    return img;
  }

  async function ensureEngine() {
    if (!('gpu' in navigator)) throw new Error('WebGPU wird in diesem Browser nicht unterstützt. Bitte Chrome/Edge mit aktivierter WebGPU-Unterstützung verwenden.');
    if (engine) return engine;
    if (loading) return loading;

    loading = (async () => {
      setStatus('KI-Laufzeit wird geladen …');
      const mod = await import(MODULE_URL);
      const createFluxKlein = mod.createFluxKlein;
      if (typeof createFluxKlein !== 'function') throw new Error('FLUX-Klein-Laufzeit konnte nicht geladen werden.');
      engine = await createFluxKlein({
        mode: 'auto',
        base: MODEL_BASE,
        workerUrl: new URL('./horsehub-ort-worker.js?v=1.27.2', window.location.href).href,
        cacheDir: 'horsehub-ai-v1',
        decoder: 'tiny',
        oneThing: true,
        threads: 1,
        onEvent(ev) {
          try { setStatus(typeof mod.formatProgress === 'function' ? mod.formatProgress(ev) : JSON.stringify(ev)); }
          catch (_) { setStatus('KI wird vorbereitet …'); }
        }
      });
      setStatus('KI-Laufzeit bereit.');
      return engine;
    })();

    try { return await loading; }
    finally { loading = null; }
  }

  function buildPrompt(style) {
    const base = 'Transform the reference horse photograph into a premium 3D animated feature-film horse portrait. Preserve the exact identity of this individual horse: same head shape, facial proportions, coat color, distinctive markings, eyes, muzzle, mane and recognizable features. Realistic equine anatomy and proportions, detailed groomed fur, believable horse eyes, polished cinematic 3D materials, subtle stylized shapes, warm natural studio lighting, soft depth of field, clean neutral background, centered head and upper neck.';
    const variants = {
      film: base + ' The look should feel like a high-end modern animated movie while keeping the horse believable and recognizable.',
      realism: base + ' Keep the stylization restrained and close to a real horse, with realistic fur and light response.',
      friendly: base + ' Give the horse a warm, friendly companion expression suitable for a family app.'
    };
    return variants[style] || variants.film;
  }

  async function generate({ source, width = 384, steps = 2, style = 'film', fullDecode = false }) {
    if (!source) throw new Error('Kein Pferdefoto vorhanden.');
    const klein = await ensureEngine();
    const maxArea = Number(klein?.limits?.maxArea || width * width);
    const area = width * width;
    if (area > maxArea) throw new Error(`Das Gerät erlaubt für diesen KI-Lauf höchstens ungefähr ${Math.floor(Math.sqrt(maxArea))}×${Math.floor(Math.sqrt(maxArea))} Pixel.`);

    const refBitmap = await loadBitmap(source);
    try {
      setStatus('Referenzfoto wird für die KI vorbereitet …');
      const reference = await klein.encodeReference(refBitmap, { width, height: width });
      const prompt = buildPrompt(style);
      const seed = Math.floor(Math.random() * 2147483647);
      setStatus(`Bild wird erzeugt (${width}×${width}, ${steps} Schritte) …`);
      const result = await klein.generate({
        prompt,
        reference,
        width,
        height: width,
        steps,
        seed,
        decoder: fullDecode ? 'full' : 'tiny'
      });
      const imageData = typeof modToImageData === 'function' ? modToImageData(result) : null;
      if (!imageData) throw new Error('KI-Ausgabe konnte nicht in ein Bild umgewandelt werden.');
      const dataUrl = imageDataToJpeg(imageData, 0.92);
      localStorage.setItem(AI_KEY, dataUrl);
      localStorage.setItem(AI_META_KEY, JSON.stringify({
        createdAt: new Date().toISOString(),
        width,
        height: width,
        steps,
        decoder: fullDecode ? 'full' : 'tiny',
        style,
        prompt
      }));
      setStatus('Fertig – KI-Bild wurde nur lokal gespeichert.');
      window.dispatchEvent(new Event('hh-ai-updated'));
      return dataUrl;
    } finally {
      try { refBitmap.close?.(); } catch (_) {}
    }
  }

  let modToImageData = null;

  async function generateWithRuntime(opts) {
    const mod = await import(MODULE_URL);
    modToImageData = mod.toImageData;
    return generate(opts);
  }

  async function clearCache() {
    if (!engine) throw new Error('Die KI-Laufzeit wurde in dieser Sitzung noch nicht geladen. Ein vollständiges Modell-Cache-Löschen ist dann absichtlich deaktiviert, damit nicht versehentlich mehrere Gigabyte neu geladen werden.');
    if (typeof engine.clearCache !== 'function') throw new Error('Diese KI-Laufzeit bietet aktuell keine sichere Cache-Löschung an.');
    await engine.clearCache();
    engine?.destroy?.();
    engine = null;
    localStorage.removeItem(AI_KEY);
    localStorage.removeItem(AI_META_KEY);
    setStatus('Lokaler KI-Cache und Ergebnis entfernt.');
    window.dispatchEvent(new Event('hh-ai-updated'));
  }

  window.HorseHubAI = {
    generate: generateWithRuntime,
    ensureEngine,
    clearCache,
    isSupported: () => 'gpu' in navigator,
    cacheInfo: () => engine?.cacheInfo?.() || null,
    keys: { AI_KEY, AI_META_KEY }
  };
})();
