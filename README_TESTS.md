# HorseHub 1.34.0 – 2D-Andalusier-Test

- Fester Begleiter für die gesamte App.
- A – Andalusier (Rappe) als geschichteter SVG-2D-Rig.
- Kein KI-Modell, kein 3D-Modell, kein externer Download.
- Unabhängige Bewegungen: Atmung, Gewichtsverlagerung, Ohren, Blinzeln, Kopf, Mähne, Schweif.
- Zufällige/asynchrone Idle-Timer statt eines starren Animationsloops.
- Reaktionen: Begrüßung, Aufgabe erledigt, Erinnerung, neugierig, ruhig.
- Direkt per Finger verschiebbar; Position und Größe werden lokal gespeichert.
- Begleiter kann in den Einstellungen vollständig deaktiviert werden.

## Test
1. ZIP entpacken und in das separate Test-Repository laden.
2. Seite auf Android Chrome öffnen.
3. Prüfen, dass unten `App-Version 1.34.0` steht.
4. 20–30 Sekunden beobachten: Atmung läuft dauerhaft, andere Bewegungen treten unabhängig und unregelmäßig auf.
5. Begleiter antippen: Reaktion/Bubble.
6. Begleiter ziehen: Position wird gespeichert.
7. Einstellungen: Begleiter deaktivieren/aktivieren und Position zurücksetzen.
8. App neu laden: Position und Aktivierungsstatus bleiben erhalten.

Hinweis: Das ist bewusst zunächst ein technisch robuster 2D-Prototyp. Die endgültige optische Detailtreue kann anschließend durch hochwertigere transparente Ebenen ersetzt werden, ohne das Animationssystem neu zu schreiben.


## 1.34.0 – realistischer Andalusier
- Die bisher einfache SVG-Figur wurde durch einen transparenten, realistisch gerenderten Andalusier als 2D-Bildlayer ersetzt.
- Die vorhandene leichte Animationssteuerung bleibt erhalten: Atmung, Gewichtsverlagerung, Ohren, Blinzeln, Kopf, Mähne und Schweif.
- Kein 3D-Modell, keine KI und kein Modell-Download.
