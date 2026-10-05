# HorseHub 1.30.0 – Fester animierter Pferdebegleiter

## Neuer Ansatz
Die lokale KI aus 1.28.x wurde vollständig aus diesem Testbuild entfernt. Es gibt keine FLUX-Dateien, keinen ONNX-Worker, kein KI-Testlabor und keinen Modell-Download mehr.

HorseHub verwendet jetzt **einen festen Begleiter für die gesamte App**. Es gibt bewusst keine Zuordnung pro Pferd und keine Begleiter-Auswahl mehr. Der Begleiter wird lokal als SVG gerendert und direkt im Browser animiert.

## Look und Animation
Der Begleiter wurde gegenüber 1.29 optisch überarbeitet: weichere Farbverläufe, Schattierung und Proportionen sowie getrennte Animationsgruppen für:
- Ohren
- Kopf
- Augen/Blinzeln
- Mähne
- Schweif
- Körper/Atmung
- Gewichtsverlagerung der Beine

Zusätzlich gibt es kurze Reaktionsbewegungen für Begrüßung, erledigte Aufgaben und Erinnerungen.

## Position
Der Begleiter kann direkt auf dem App-Bildschirm per Finger/Maus gezogen werden. Die Position wird lokal gespeichert. Über **Position zurücksetzen** kann die Standardposition wiederhergestellt werden.

## Test
1. App öffnen und Einstellungen → Pferdebegleiter aufrufen.
2. Prüfen, dass kein Pferde-/Vorlagen-Auswahlmenü mehr vorhanden ist.
3. Begleiter direkt mit dem Finger an eine freie Stelle ziehen.
4. App neu laden und prüfen, ob die Position erhalten bleibt.
5. Größe ändern und Animation testen.
6. Prüfen, dass der Begleiter beim Verschieben nicht versehentlich eine App-Funktion auslöst.
