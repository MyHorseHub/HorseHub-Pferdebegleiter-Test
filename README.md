# HorseHub 3D-Begleiter – Techniktest

Separater Prototyp für HorseHub: realistischere 3D-Basis mit GLB + Three.js.

## Ziel

Dieser Test ist **nicht** die neue HorseHub-Produktversion. Er prüft nur die technische Basis, bevor wir den festen Andalusier als endgültiges Asset bauen.

Getestet werden:
- GLB-Laden im mobilen Browser
- WebGL2/WebGL-Rendering
- AnimationMixer/AnimationClips
- Geschwindigkeit und Stabilität
- Kamerasteuerung per Finger/Drag
- Modellgröße
- Verhalten auf Smartphone-GPUs

## Asset

Verwendet wird vorläufig `Horse.glb` aus dem offiziellen Three.js-Horse-Beispiel. Das Three.js-Beispiel führt das Modell auf die Quelle „mirada from rome“ zurück; die Produktionslizenz des konkreten Assets ist vor Einsatz in HorseHub separat zu klären. Der Test soll deshalb zunächst nur die Technik prüfen.

## Engine

Three.js 0.186.1 wird fest über jsDelivr geladen. Three.js selbst ist MIT-lizenziert.

## Erwartetes Ergebnis

Auf dem Smartphone soll innerhalb weniger Sekunden ein 3D-Pferd erscheinen. Die App bietet Play/Pause, Animationsauswahl (sofern Clips vorhanden), Geschwindigkeit, Größe, Kamera-Reset und Auto-Drehung.

## Nächster Schritt

Wenn dieser Test stabil ist, ersetzen wir nur das Test-Asset durch ein passend modelliertes, geriggtes Andalusier-GLB und übertragen unsere HorseHub-A1–A8- und R1–R8-Logik auf dieses Modell.
