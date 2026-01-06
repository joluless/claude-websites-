// Hand Tracking mit MediaPipe Hands
class HandTracking {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.results = null;
        this.isActive = true;
        this.onResultsCallback = null;
    }

    async init(videoElement, onResults) {
        this.onResultsCallback = onResults;

        // MediaPipe Hands konfigurieren
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
            this.results = results;
            if (this.onResultsCallback && this.isActive) {
                this.onResultsCallback(results);
            }
        });

        // Kamera initialisieren
        this.camera = new Camera(videoElement, {
            onFrame: async () => {
                if (this.isActive) {
                    await this.hands.send({ image: videoElement });
                }
            },
            width: 1280,
            height: 720
        });

        await this.camera.start();
        updateStatus('Tracking aktiv', true);
    }

    toggle() {
        this.isActive = !this.isActive;
        return this.isActive;
    }

    getResults() {
        return this.results;
    }

    // Berechnet Distanz zwischen zwei Landmarks
    static getDistance(landmark1, landmark2) {
        const dx = landmark1.x - landmark2.x;
        const dy = landmark1.y - landmark2.y;
        const dz = landmark1.z - landmark2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Berechnet 2D Distanz (nur x, y)
    static getDistance2D(landmark1, landmark2) {
        const dx = landmark1.x - landmark2.x;
        const dy = landmark1.y - landmark2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Prüft ob Finger gestreckt ist
    static isFingerExtended(landmarks, fingerTip, fingerPip) {
        // Vergleicht die Y-Position der Fingerspitze mit dem PIP-Gelenk
        return landmarks[fingerTip].y < landmarks[fingerPip].y;
    }

    // Gibt wichtige Distanzen zurück
    static getFingerDistances(landmarks) {
        // MediaPipe Hand Landmarks Indizes:
        // 0: Handgelenk
        // 4: Daumen-Spitze
        // 8: Zeigefinger-Spitze
        // 12: Mittelfinger-Spitze
        // 16: Ringfinger-Spitze
        // 20: Kleiner Finger-Spitze

        return {
            thumbIndex: this.getDistance(landmarks[4], landmarks[8]),      // Daumen-Zeigefinger
            thumbMiddle: this.getDistance(landmarks[4], landmarks[12]),    // Daumen-Mittelfinger
            thumbRing: this.getDistance(landmarks[4], landmarks[16]),      // Daumen-Ringfinger
            thumbPinky: this.getDistance(landmarks[4], landmarks[20]),     // Daumen-Kleiner Finger
            indexMiddle: this.getDistance(landmarks[8], landmarks[12]),    // Zeigefinger-Mittelfinger

            // 2D Distanzen für bessere Kontrolle
            thumbIndex2D: this.getDistance2D(landmarks[4], landmarks[8]),
            thumbMiddle2D: this.getDistance2D(landmarks[4], landmarks[12]),
            thumbRing2D: this.getDistance2D(landmarks[4], landmarks[16])
        };
    }

    // Erkennt Gesten
    static detectGesture(landmarks) {
        const indexExtended = this.isFingerExtended(landmarks, 8, 6);
        const middleExtended = this.isFingerExtended(landmarks, 12, 10);
        const ringExtended = this.isFingerExtended(landmarks, 16, 14);
        const pinkyExtended = this.isFingerExtended(landmarks, 20, 18);

        // Zeigefinger allein = Malen
        if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'PAINT';
        }

        // Alle Finger gestreckt = Offene Hand
        if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
            return 'OPEN_HAND';
        }

        // Faust = Pause
        if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'FIST';
        }

        return 'OTHER';
    }
}

// Status-Update Funktion
function updateStatus(message, isActive) {
    const statusElement = document.getElementById('statusText');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.style.color = isActive ? '#28a745' : '#dc3545';
    }
}

// Globale HandTracking Instanz
let handTracker = null;
