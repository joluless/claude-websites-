# 🚀 Deployment & Zugriff

## Option 1: GitHub Pages (Empfohlen für iOS/macOS)

### Setup:
1. Gehe zu https://github.com/joluless/claude-websites-/settings/pages
2. Unter "Source" wähle:
   - **Branch:** `claude/hand-tracking-paint-synth-6QI0y`
   - **Ordner:** `/ (root)`
3. Speichern und 1-2 Minuten warten

### Dann erreichbar unter:
```
https://joluless.github.io/claude-websites-/
```

✅ **Vorteil:** HTTPS automatisch → Kamera-Zugriff funktioniert auf iOS!

---

## Option 2: Lokaler Server auf macOS

### Mit Python (vorinstalliert):
```bash
# Repository klonen
git clone https://github.com/joluless/claude-websites-.git
cd claude-websites-
git checkout claude/hand-tracking-paint-synth-6QI0y

# Server starten
python3 -m http.server 8080
```

Dann öffnen: **http://localhost:8080**

### Mit npm:
```bash
npm install
npm start
```

---

## Option 3: Online-Editor (Sofort testen)

1. Gehe zu **CodeSandbox** oder **CodePen**
2. Importiere das GitHub Repository
3. Direkt im Browser testen

---

## 📱 iOS Besonderheiten

### ⚠️ Wichtig zu wissen:
- **Chrome auf iOS = Safari WebKit Engine** (Apple Einschränkung)
- **Kamera-Zugriff erfordert HTTPS** (außer localhost)
- Safari auf iOS funktioniert genauso gut wie Chrome

### Beste Browser für iOS:
1. ✅ **Safari** (nativ, beste Performance)
2. ✅ **Chrome** (gleiche Engine wie Safari)
3. ✅ **Edge** (gleiche Engine wie Safari)

### HTTPS ist erforderlich für:
- Kamera-Zugriff
- Audio-Zugriff
- Vollbild-Modus

**Lösung:** Nutze GitHub Pages oder einen HTTPS-Server!

---

## 🖥️ macOS Zugriff

### Methode A: GitHub Pages (siehe oben)
### Methode B: Lokaler Server (siehe oben)
### Methode C: Direkt öffnen

⚠️ **Problem:** Kamera-Zugriff kann blockiert werden bei `file://` Protokoll

**Besser:** Nutze immer einen lokalen Server (Python oder npm)

---

## 🔗 Direkte Links

### Repository:
```
https://github.com/joluless/claude-websites-/tree/claude/hand-tracking-paint-synth-6QI0y
```

### Raw-Dateien (für CDN):
```
https://raw.githubusercontent.com/joluless/claude-websites-/claude/hand-tracking-paint-synth-6QI0y/index.html
```

---

## ✅ Schnelltest ohne Installation

### jsDelivr CDN (Direkt nutzbar):

Öffne diese URL in deinem Browser:
```
https://cdn.jsdelivr.net/gh/joluless/claude-websites-@claude/hand-tracking-paint-synth-6QI0y/index.html
```

⚠️ **Aber:** CDN-Links können bei HTML mit relativen Pfaden Probleme haben

---

## 🎯 Empfohlene Schritte für iOS/macOS:

1. **Aktiviere GitHub Pages** (einmalig, 2 Minuten)
2. **Öffne den GitHub Pages Link** auf deinem iPhone/Mac
3. **Erlaube Kamera-Zugriff**
4. **Fertig!** 🎉

---

## 🐛 Troubleshooting

### "Kamera funktioniert nicht"
- ✅ Nutze HTTPS (GitHub Pages oder localhost)
- ✅ Erlaube Kamera in Browser-Einstellungen
- ✅ Schließe andere Apps die Kamera nutzen

### "Seite lädt nicht"
- ✅ Prüfe Internet-Verbindung (CDN-Links benötigt)
- ✅ Lösche Browser-Cache
- ✅ Versuche anderen Browser

### "Sound funktioniert nicht"
- ✅ Klicke auf "Sound: An" Button (User-Interaktion erforderlich)
- ✅ Prüfe System-Lautstärke
- ✅ Prüfe Browser-Audio-Berechtigung

---

## 📦 Alle Abhängigkeiten sind CDN-basiert:

✅ **p5.js** - von cdnjs.cloudflare.com
✅ **MediaPipe** - von cdn.jsdelivr.net
✅ **Tone.js** - von cdnjs.cloudflare.com

**Das bedeutet:** Keine Installation nötig, funktioniert direkt im Browser! 🚀
