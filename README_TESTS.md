# HorseHub 1.27.0 – Browser-Test

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


## HorseHub 1.27.0 – Lokales KI-Testlabor

Zusätzlich zu `horse-companion.js` und `horse-companion.css` gibt es jetzt ein bewusst isoliertes `horse-companion-ai-lab.html` plus `horse-companion-ai.js`. Die Haupt-App lädt keine schweren KI-Gewichte. Erst das Testlabor lädt die WebGPU-KI bei einem ausdrücklichen Klick.

### Ablauf
1. App und Testlabor auf derselben GitHub-Pages-Adresse veröffentlichen.
2. In HorseHub das Begleiterfoto wählen und „✨ Lokales KI-Testlabor öffnen“ aufrufen.
3. Im Testlabor Pferd/Fotoreferenz kontrollieren und zunächst 384×384 + 2 Schritte verwenden.
4. „KI-Bild erzeugen“ drücken. Beim ersten Mal werden die mobilen, quantisierten Modellgewichte heruntergeladen und im Browser lokal zwischengespeichert.
5. Nach erfolgreicher Generierung wird das Ergebnis unter `hhCompanionPhotoAI_v1` gespeichert. Zurück in HorseHub „✨ KI-3D-Filmstil“ wählen.

Wichtig: Die KI-Verarbeitung erfolgt im Browser. Die Modellgewichte werden für den ersten Start aus dem öffentlichen Model-Repository geladen; das Pferdefoto wird nicht an einen KI-Server hochgeladen. Der mobile Pfad von `flux-klein.js` ist für WebGPU und geringe Gerätespeicher ausgelegt, braucht aber trotzdem mehrere Gigabyte lokalen Speicher für die Modell-Dateien.

Der Prototyp arbeitet zunächst absichtlich mit 2 Schritten und dem „tiny“-Decoder, damit der erste Test realistischer auf einem Telefon durchführbar ist. 512×512 + 4 Schritte + voller Decoder ist als separater Qualitätstest verfügbar und kann deutlich langsamer bzw. speicherintensiver sein.
