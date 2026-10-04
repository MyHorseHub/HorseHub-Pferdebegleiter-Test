# HorseHub 1.26.1 – Browser-Test

## Lokal ausführen

Voraussetzungen: Python 3 und Playwright mit Chromium.

```bash
python -m pip install playwright
python -m playwright install chromium
python tests/horsehub_browser_test.py
```

Der Test simuliert Benachrichtigungen im Browser und prüft Termin-, Medikamenten-, Fütterungs- und Routinen-Erinnerungen einschließlich Duplikatschutz. Er prüft nicht die tatsächliche Zustellung durch Android, wenn die App geschlossen oder im Hintergrund ist. Das ist bewusst nicht Teil des Local-only-Modus.


## HorseHub 1.26.0 – Animierter Pferdebegleiter-Prototyp

Neue, eigenständige Dateien: `horse-companion.css` und `horse-companion.js`. Die App lädt sie zusätzlich; Kernfunktionen bleiben unangetastet. Der Begleiter nutzt nach Möglichkeit das Foto des ausgewählten Pferdes und zeigt eine animierte, anklickbare Schaltfläche auf allen App-Seiten.

### Schnelltest
1. ZIP entpacken und wie gewohnt die fünf bisherigen PWA-Dateien sowie die zwei neuen Dateien im gleichen GitHub-Pages-Verzeichnis bereitstellen (die Tests und README bleiben optional).
2. App öffnen und einloggen. Unten erscheint das Pferde-Symbol.
3. Symbol antippen → „Einstellen“ → Pferd wählen, Größe/Position ändern und Reaktionen testen.
4. Auf der Startseite eine Aufgabe abhaken: bei aktivierter Aufgabenreaktion sollte das Pferd freudig reagieren.
5. Prüfen, dass Pferdeprofile, Fotos, Aufgaben und Routinen weiterhin funktionieren.
6. PWA vollständig schließen und erneut öffnen, um das aktualisierte Service-Worker-Cache-Verhalten zu prüfen.

Einstellungen werden separat unter `hhCompanionSettings_v1` lokal gespeichert. Der Prototyp erzeugt keine Datenbanktabellen, verändert keine Pferde-/Aufgabendatensätze und verspricht keine automatischen Hintergrund-Push-Erinnerungen. „Erinnerung“ ist in diesem Stand eine manuell auslösbare Reaktion.


### Pferdebegleiter 1.26.1
- Settings panel includes camera/gallery upload for a dedicated companion photo.
- Companion photo is resized locally and a lightweight local cartoon variant is generated.
- UI offers Cartoon / Originalfoto display mode; companion settings/photo keys are isolated from horse/cloud sync.
