// p5.js Sketch für Hand Tracking Paint & Synth

let videoElement;
let canvasWidth = 1280;
let canvasHeight = 720;

// Zeichnen-Variablen
let drawing = [];
let currentStroke = [];
let isDrawing = false;
let prevIndexPos = null;

// Hand-Daten
let currentHandLandmarks = null;
let currentDistances = null;
let currentGesture = null;

// Farb-Variablen
let currentColor;
let hueValue = 0;

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5canvas');

    // Initialisiere Farbe
    colorMode(HSB, 360, 100, 100);
    currentColor = color(0, 80, 90);

    // Initialisiere Sound-Synthese
    soundSynth = new SoundSynth();

    // Initialisiere Hand-Tracking
    videoElement = document.getElementById('videoElement');
    handTracker = new HandTracking();

    handTracker.init(videoElement, onHandResults)
        .catch(err => {
            console.error('Fehler beim Initialisieren des Hand-Trackings:', err);
            updateStatus('Fehler beim Zugriff auf Kamera', false);
        });

    // Button-Event-Listener
    document.getElementById('toggleSound').addEventListener('click', toggleSound);
    document.getElementById('clearCanvas').addEventListener('click', clearDrawing);
    document.getElementById('toggleTracking').addEventListener('click', toggleTracking);

    background(255);
}

function draw() {
    // Hintergrund leicht transparent für Trail-Effekt
    background(255, 255, 255, 10);

    // Zeichne alle bisherigen Striche
    for (let stroke of drawing) {
        drawStroke(stroke);
    }

    // Zeichne aktuellen Strich
    if (currentStroke.length > 0) {
        drawStroke(currentStroke);
    }

    // Zeichne Hand-Landmarks und Verbindungen
    if (currentHandLandmarks) {
        drawHandSkeleton(currentHandLandmarks);
        drawFingerTips(currentHandLandmarks);

        // Zeichne Zeigefinger-Position für Malen
        if (currentGesture === 'PAINT') {
            let indexTip = currentHandLandmarks[8];
            let x = indexTip.x * width;
            let y = indexTip.y * height;

            // Zeige Cursor
            push();
            noFill();
            stroke(currentColor);
            strokeWeight(3);
            circle(x, y, 30);
            pop();

            // Male, wenn Zeigefinger gestreckt
            if (prevIndexPos) {
                currentStroke.push({
                    x: x,
                    y: y,
                    color: currentColor
                });
            }

            prevIndexPos = { x, y };
        } else {
            // Beende aktuellen Strich
            if (currentStroke.length > 0) {
                drawing.push([...currentStroke]);
                currentStroke = [];
            }
            prevIndexPos = null;
        }
    }

    // Zeige Distanz-Informationen (für Debugging)
    if (currentDistances) {
        drawDistanceInfo(currentDistances);
    }

    // Update Farbe (rotiert durch Farbraum)
    hueValue = (hueValue + 0.5) % 360;
    currentColor = color(hueValue, 80, 90);
}

function drawStroke(stroke) {
    if (stroke.length < 2) return;

    push();
    noFill();

    for (let i = 1; i < stroke.length; i++) {
        let p1 = stroke[i - 1];
        let p2 = stroke[i];

        stroke(p1.color || currentColor);
        strokeWeight(5);
        line(p1.x, p1.y, p2.x, p2.y);

        // Punkte an den Positionen
        fill(p1.color || currentColor);
        noStroke();
        circle(p1.x, p1.y, 5);
    }

    // Letzter Punkt
    let lastPoint = stroke[stroke.length - 1];
    fill(lastPoint.color || currentColor);
    noStroke();
    circle(lastPoint.x, lastPoint.y, 5);

    pop();
}

function drawHandSkeleton(landmarks) {
    push();

    // Verbindungen zwischen Fingerknochen
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],     // Daumen
        [0, 5], [5, 6], [6, 7], [7, 8],     // Zeigefinger
        [0, 9], [9, 10], [10, 11], [11, 12], // Mittelfinger
        [0, 13], [13, 14], [14, 15], [15, 16], // Ringfinger
        [0, 17], [17, 18], [18, 19], [19, 20], // Kleiner Finger
        [5, 9], [9, 13], [13, 17]            // Handinnenfläche
    ];

    stroke(100, 150, 255, 150);
    strokeWeight(2);

    for (let [start, end] of connections) {
        let p1 = landmarks[start];
        let p2 = landmarks[end];
        line(p1.x * width, p1.y * height, p2.x * width, p2.y * height);
    }

    pop();
}

function drawFingerTips(landmarks) {
    push();

    // Fingerspitzen: 4, 8, 12, 16, 20
    const fingerTips = [4, 8, 12, 16, 20];
    const colors = [
        color(255, 100, 100), // Daumen
        color(100, 255, 100), // Zeigefinger
        color(100, 100, 255), // Mittelfinger
        color(255, 255, 100), // Ringfinger
        color(255, 100, 255)  // Kleiner Finger
    ];

    for (let i = 0; i < fingerTips.length; i++) {
        let tip = landmarks[fingerTips[i]];
        fill(colors[i]);
        noStroke();
        circle(tip.x * width, tip.y * height, 12);
    }

    pop();
}

function drawDistanceInfo(distances) {
    push();
    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    let y = 20;
    let x = 20;

    text(`Daumen-Zeigefinger: ${(distances.thumbIndex2D * 100).toFixed(1)}`, x, y);
    y += 20;
    text(`Daumen-Mittelfinger: ${(distances.thumbMiddle2D * 100).toFixed(1)}`, x, y);
    y += 20;
    text(`Daumen-Ringfinger: ${(distances.thumbRing2D * 100).toFixed(1)}`, x, y);
    y += 20;

    if (soundSynth && soundSynth.isActive) {
        text(soundSynth.getDebugInfo(distances), x, y);
    }

    pop();
}

// Callback für Hand-Tracking-Ergebnisse
function onHandResults(results) {
    // Update Anzahl erkannter Hände
    const handsCountElement = document.getElementById('handsCount');
    if (handsCountElement) {
        handsCountElement.textContent = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Verwende erste erkannte Hand
        currentHandLandmarks = results.multiHandLandmarks[0];

        // Berechne Fingerknochen-Distanzen
        currentDistances = HandTracking.getFingerDistances(currentHandLandmarks);

        // Erkenne Geste
        currentGesture = HandTracking.detectGesture(currentHandLandmarks);

        // Update Sound-Synthese
        if (soundSynth && soundSynth.isActive) {
            soundSynth.updateFromDistances(currentDistances);
        }
    } else {
        currentHandLandmarks = null;
        currentDistances = null;
        currentGesture = null;

        // Stoppe Sound wenn keine Hand erkannt
        if (soundSynth) {
            soundSynth.stop();
        }
    }
}

// Button-Handler
async function toggleSound() {
    if (!soundSynth) {
        soundSynth = new SoundSynth();
    }

    const isActive = await soundSynth.toggle();
    const button = document.getElementById('toggleSound');
    button.textContent = `Sound: ${isActive ? 'An' : 'Aus'}`;
    button.style.background = isActive ? '#28a745' : '#667eea';
}

function clearDrawing() {
    drawing = [];
    currentStroke = [];
    background(255);
}

function toggleTracking() {
    if (handTracker) {
        const isActive = handTracker.toggle();
        const button = document.getElementById('toggleTracking');
        button.textContent = `Tracking: ${isActive ? 'An' : 'Aus'}`;
        button.style.background = isActive ? '#28a745' : '#dc3545';

        updateStatus(isActive ? 'Tracking aktiv' : 'Tracking pausiert', isActive);
    }
}

// Keyboard-Shortcuts
function keyPressed() {
    if (key === 'c' || key === 'C') {
        clearDrawing();
    }
    if (key === 's' || key === 'S') {
        toggleSound();
    }
    if (key === 't' || key === 'T') {
        toggleTracking();
    }
}
