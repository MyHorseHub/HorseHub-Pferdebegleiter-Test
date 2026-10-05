# HorseHub 1.29.0 – Animierter Pferdebegleiter

## Neuer Ansatz
Die lokale KI aus 1.28.x wurde vollständig aus diesem Testbuild entfernt. Es gibt keine FLUX-Dateien, keinen ONNX-Worker, kein KI-Testlabor und keinen Modell-Download mehr.

Der Pferdebegleiter nutzt stattdessen eine lokale Vorlagen-Datenbank (`companion-db.js`). Die Figuren werden als SVG direkt im Browser gerendert und animiert. Die Auswahl wird je Pferd in `localStorage` gespeichert.

## Animationen
Jede Vorlage enthält laufende Idle-Animationen für:
- Ohren
- Kopf
- Augen/Blinzeln
- Mähne
- Schweif
- Körper/Atmung
- Beine

Zusätzlich gibt es Reaktionsbewegungen für Begrüßung, erledigte Aufgaben und Erinnerungen.

## Test
1. App öffnen.
2. Einstellungen → Pferdebegleiter.
3. „Begleiter auswählen“.
4. Verschiedene Vorlagen anklicken.
5. „Animation testen“ und „Reaktion testen“ verwenden.
6. App neu laden und prüfen, ob die Auswahl pro Pferd erhalten bleibt.
7. Mit zwei Pferden testen: Die Auswahl darf nicht vertauscht werden.
