# HorseHub 1.40.0 – 2D-Andalusier-Test

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
3. Prüfen, dass unten `App-Version 1.40.0` steht.
4. 20–30 Sekunden beobachten: Atmung läuft dauerhaft, andere Bewegungen treten unabhängig und unregelmäßig auf.
5. Begleiter antippen: Reaktion/Bubble.
6. Begleiter ziehen: Position wird gespeichert.
7. Einstellungen: Begleiter deaktivieren/aktivieren und Position zurücksetzen.
8. App neu laden: Position und Aktivierungsstatus bleiben erhalten.

Hinweis: Das ist bewusst zunächst ein technisch robuster 2D-Prototyp. Die endgültige optische Detailtreue kann anschließend durch hochwertigere transparente Ebenen ersetzt werden, ohne das Animationssystem neu zu schreiben.


## 1.40.0 – realistischer Andalusier
- Die bisher einfache SVG-Figur wurde durch einen transparenten, realistisch gerenderten Andalusier als 2D-Bildlayer ersetzt.
- Die vorhandene leichte Animationssteuerung bleibt erhalten: Atmung, Gewichtsverlagerung, Ohren, Blinzeln, Kopf, Mähne und Schweif.
- Kein 3D-Modell, keine KI und kein Modell-Download.

## 1.40.0 Verfeinerung
- Kopf/Hals weiter isoliert; kein Körper-Rig.
- Hals/Atmung, Kopfbewegung, Ohren und Mähne laufen in getrennten Ebenen.
- Mähne folgt der Kopfbewegung leicht verzögert.
- Ohren reagieren unabhängig und asymmetrisch.
- Synchrones Blinzeln bleibt erhalten.


## Testschwerpunkt 1.40.0
- Kopf und Hals bleiben isoliert; kein Ganzkörper-Rig.
- Halsbewegung/Atmung ist eine eigene äußere Ebene.
- Kopfbewegung ist eine eigene innere Ebene.
- Mähne folgt der Kopfbewegung leicht verzögert als separate Layer.
- Linkes/rechtes Ohr werden unabhängig bewegt.
- Beide Augenlider werden mit demselben Timer gleichzeitig ausgelöst.


## 1.40.0 Änderungen
- Mähnenbewegung entfernt; die Mähne bleibt als Teil des Bildes ruhig.
- Neues dezentes Kopfnicken ergänzt.
- Reparierter rechter Ohrbereich im Kopf-Asset, damit das Ohr nicht mehr am Bildrand abgeschnitten ist.
- Gleichzeitiges Blinzeln bleibt unverändert.


1.40.0: Hintergrundreste des Kopf-Assets reduziert; Mähne bleibt statisch; Kopf/Hals/Ohren/Blinzeln/Kopfnicken als abgestimmter Bewegungszyklus mit nicht überlappenden Kopfaktionen.


## 1.40.0
- Originalbild unverändert als visuelle Referenz.
- Ohr-Overlay-Ebenen vollständig entfernt, damit keine versetzten/doppelten Ohren entstehen.
- Ohren bleiben exakt dort, wo sie im Originalbild sitzen.
- Kopf, Hals, synchrones Blinzeln und Kopfnicken bleiben aktiv.
