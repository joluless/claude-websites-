# Hand Tracking Paint & Synth

Eine interaktive Webanwendung, die Hand-Tracking mit kreativem Malen und Sound-Synthese verbindet. Verwende deine Hände, um visuell zu zeichnen und gleichzeitig Töne zu erzeugen!

## Features

🎨 **Hand-Tracking Malen**
- Male mit deinem Zeigefinger auf einem digitalen Canvas
- Automatische Farb-Rotation für bunte Zeichnungen
- Sanfte Trail-Effekte für organische Linien

🎵 **Gestenbasierte Sound-Synthese**
- **Daumen-Zeigefinger Distanz** → Steuert die Tonhöhe (näher = höher)
- **Daumen-Mittelfinger Distanz** → Steuert die Lautstärke (näher = lauter)
- **Daumen-Ringfinger Distanz** → Steuert den Filter (näher = heller)

👋 **Gestenerkennung**
- **Zeigefinger gestreckt**: Malen aktivieren
- **Offene Hand**: Pause
- **Faust**: Komplett pausieren

## Technologie-Stack

- **p5.js** - Canvas-Rendering und visuelle Effekte
- **MediaPipe Hands** - Echtzeit Hand-Tracking
- **Tone.js** - Web Audio Synthese
- Reines JavaScript (ES6+)
- **Single-File HTML** - Alles in einer Datei für maximale Portabilität! 📦

## Installation & Start

### ⚡ Schnellstart (Einfachste Methode)

**Die Anwendung ist eine einzige HTML-Datei - öffne einfach `index.html` im Browser!**

Alle Abhängigkeiten werden über CDN geladen, keine Installation nötig!

### Option 1: Direktes Öffnen

Doppelklick auf `index.html` → Fertig! ✅

**Wichtig für Kamera-Zugriff:** Einige Browser (Chrome, Safari) blockieren Kamera bei `file://` URLs.
Wenn die Kamera nicht funktioniert, nutze einen der lokalen Server unten.

### Option 2: Mit npm

```bash
# Server starten (npm install bereits gemacht)
npm start
```

Die Anwendung öffnet sich automatisch unter `http://localhost:8080`

### Option 3: Mit Python (ohne npm)

**Empfohlene Alternative mit Python:**

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Dann öffne `http://localhost:8080` im Browser.

## Verwendung

### Erste Schritte

1. **Kamera-Zugriff erlauben** - Der Browser fragt beim ersten Start nach Kamera-Berechtigung
2. **Hand positionieren** - Halte deine Hand(fläche) vor die Kamera
3. **Warten auf Erkennung** - Die Hand sollte innerhalb von 1-2 Sekunden erkannt werden

### Bedienung

#### Malen
- Strecke nur den **Zeigefinger** aus
- Bewege deine Hand, um zu malen
- Die Farbe wechselt automatisch

#### Sound erzeugen
1. Klicke auf **"Sound: An"** Button
2. Verändere die Distanzen zwischen Daumen und anderen Fingern:
   - **Zeigefinger**: Tonhöhe
   - **Mittelfinger**: Lautstärke
   - **Ringfinger**: Filter/Klangfarbe

#### Steuerung
- **Canvas leeren**: Löscht alle Zeichnungen
- **Tracking pausieren**: Stoppt Hand-Erkennung temporär
- **Sound an/aus**: Aktiviert/deaktiviert Audio

### Tastatur-Shortcuts

- `C` - Canvas leeren
- `S` - Sound an/aus
- `T` - Tracking an/aus

## Projektstruktur

```
hand-tracking-paint-synth/
├── index.html              # 🎯 ALLES IN EINER DATEI!
│                           # Enthält: HTML, CSS, JavaScript,
│                           # HandTracking, SoundSynth, p5.js Sketch
├── package.json            # Optional: npm Server-Scripts
├── README.md               # Diese Datei
└── DEPLOYMENT.md          # Deployment-Anleitung für iOS/macOS
```

**📦 Single-File Design:**
- Alle Styles inline im `<style>`-Tag
- Gesamter JavaScript-Code inline im `<script>`-Tag
- Externe Bibliotheken über CDN (p5.js, MediaPipe, Tone.js)
- Keine Build-Steps, keine Dependencies
- Perfekt zum Teilen und Deployen!

## Technische Details

### Hand-Tracking

Die Anwendung verwendet **MediaPipe Hands**, das 21 3D-Landmarks pro Hand erkennt:

```
Landmark-Indizes:
0:  Handgelenk
1-4:  Daumen (1=CMC, 2=MCP, 3=IP, 4=Spitze)
5-8:  Zeigefinger (5=MCP, 6=PIP, 7=DIP, 8=Spitze)
9-12: Mittelfinger
13-16: Ringfinger
17-20: Kleiner Finger
```

### Distanz-Berechnung

Fingerknochen-Distanzen werden sowohl in 3D als auch 2D berechnet:

```javascript
// 3D Distanz (x, y, z)
distance3D = sqrt(dx² + dy² + dz²)

// 2D Distanz (x, y) - verwendet für stabilere Kontrolle
distance2D = sqrt(dx² + dy²)
```

### Sound-Synthese

Die Sound-Engine basiert auf **Tone.js** und verwendet:
- **Synthesizer**: Sinus-Welle mit ADSR-Hüllkurve
- **Filter**: Lowpass-Filter (Cutoff steuerbar)
- **Frequency Range**: C3 (130.81 Hz) bis C6 (1046.50 Hz)
- **Smooth Ramping**: 50ms Übergangszeit für flüssige Parameter-Änderungen

## Browser-Kompatibilität

Getestet mit:
- ✅ Chrome/Chromium 90+
- ✅ Edge 90+
- ✅ Opera 76+
- ⚠️ Firefox 88+ (MediaPipe kann Probleme haben)
- ❌ Safari (begrenzte MediaPipe-Unterstützung)

**Empfehlung**: Chrome oder Chromium-basierte Browser für beste Performance

## Anforderungen

- Moderne Webcam
- Gute Beleuchtung
- Mindestens 2 Mbps Upload (für Kamera-Stream)
- Browser mit WebGL-Unterstützung

## Fehlerbehebung

### "Kamera nicht gefunden"
- Überprüfe Browser-Berechtigungen
- Stelle sicher, dass keine andere Anwendung die Kamera nutzt
- Versuche einen Browser-Neustart

### "Hand wird nicht erkannt"
- Verbessere die Beleuchtung
- Halte die Hand näher an die Kamera
- Stelle sicher, dass die Handfläche zur Kamera zeigt
- Vermeide komplizierte Hintergründe

### "Sound funktioniert nicht"
- Klicke auf "Sound: An" Button (User-Interaktion erforderlich)
- Überprüfe Browser-Audio-Berechtigungen
- Teste mit Lautstärke-Regler

### Performance-Probleme
- Schließe andere Browser-Tabs
- Reduziere Kamera-Auflösung (in `handTracking.js`)
- Verwende Chrome für bessere Performance

## Erweiterungsmöglichkeiten

Ideen für weitere Features:

- 🎨 Verschiedene Pinsel-Modi (Spray, Kalligraphie, etc.)
- 🎵 Mehrere Synthesizer (Polyphonie)
- 📊 Aufnahme und Playback von Zeichnungen
- 🎭 Verschiedene Sound-Presets
- 👥 Mehrere Hände gleichzeitig
- 💾 Speichern/Laden von Kunstwerken
- 🎹 Musikskalen (statt freier Frequenzen)

## Lizenz

MIT License - Frei verwendbar für private und kommerzielle Projekte

## Credits

- **MediaPipe** von Google - Hand-Tracking
- **p5.js** - Creative Coding Framework
- **Tone.js** - Web Audio Framework

---

Viel Spaß beim Experimentieren! 🎨🎵👋
