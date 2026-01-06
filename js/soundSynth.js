// Sound-Synthese mit Tone.js
class SoundSynth {
    constructor() {
        this.isActive = false;
        this.synth = null;
        this.filter = null;
        this.volume = null;
        this.initialized = false;

        // Frequenz-Bereich (C3 bis C6)
        this.minFreq = 130.81;  // C3
        this.maxFreq = 1046.50; // C6

        // Filter-Bereich
        this.minFilterFreq = 200;
        this.maxFilterFreq = 5000;

        // Lautstärke-Bereich
        this.minVolume = -30;
        this.maxVolume = -5;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Warte auf User-Interaktion für Audio-Context
            await Tone.start();

            // Erstelle Synthesizer mit Filter und Lautstärke
            this.filter = new Tone.Filter({
                type: 'lowpass',
                frequency: 1000,
                rolloff: -12,
                Q: 1
            });

            this.volume = new Tone.Volume(this.minVolume);

            this.synth = new Tone.Synth({
                oscillator: {
                    type: 'sine'
                },
                envelope: {
                    attack: 0.05,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 0.8
                }
            }).chain(this.filter, this.volume, Tone.Destination);

            this.initialized = true;
            console.log('Sound-Synthese initialisiert');
        } catch (error) {
            console.error('Fehler beim Initialisieren der Sound-Synthese:', error);
        }
    }

    async toggle() {
        if (!this.initialized) {
            await this.init();
        }

        this.isActive = !this.isActive;

        if (!this.isActive && this.synth) {
            this.synth.triggerRelease();
        }

        return this.isActive;
    }

    // Mapped einen Wert von einem Bereich in einen anderen
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    // Begrenzt einen Wert zwischen min und max
    constrain(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Update-Funktion mit Fingerknochen-Distanzen
    updateFromDistances(distances) {
        if (!this.isActive || !this.initialized || !this.synth) return;

        try {
            // Distanz Daumen-Zeigefinger -> Tonhöhe
            // Kleinere Distanz = höhere Tonhöhe
            let freq = this.map(
                this.constrain(distances.thumbIndex2D, 0.02, 0.3),
                0.02,
                0.3,
                this.maxFreq,
                this.minFreq
            );

            // Distanz Daumen-Mittelfinger -> Lautstärke
            // Kleinere Distanz = lauter
            let vol = this.map(
                this.constrain(distances.thumbMiddle2D, 0.02, 0.3),
                0.02,
                0.3,
                this.maxVolume,
                this.minVolume
            );

            // Distanz Daumen-Ringfinger -> Filter-Cutoff
            // Kleinere Distanz = hellerer Sound
            let filterFreq = this.map(
                this.constrain(distances.thumbRing2D, 0.02, 0.3),
                0.02,
                0.3,
                this.maxFilterFreq,
                this.minFilterFreq
            );

            // Sanfte Übergänge mit ramping
            const rampTime = 0.05;

            this.synth.frequency.rampTo(freq, rampTime);
            this.volume.volume.rampTo(vol, rampTime);
            this.filter.frequency.rampTo(filterFreq, rampTime);

            // Trigger Note wenn noch nicht spielend
            if (this.synth.state !== 'started') {
                this.synth.triggerAttack(freq);
            }

        } catch (error) {
            console.error('Fehler beim Update der Sound-Parameter:', error);
        }
    }

    // Zeigt aktuelle Werte (für Debugging)
    getDebugInfo(distances) {
        if (!distances) return '';

        const freq = this.map(
            this.constrain(distances.thumbIndex2D, 0.02, 0.3),
            0.02,
            0.3,
            this.maxFreq,
            this.minFreq
        );

        const vol = this.map(
            this.constrain(distances.thumbMiddle2D, 0.02, 0.3),
            0.02,
            0.3,
            this.maxVolume,
            this.minVolume
        );

        const filterFreq = this.map(
            this.constrain(distances.thumbRing2D, 0.02, 0.3),
            0.02,
            0.3,
            this.maxFilterFreq,
            this.minFilterFreq
        );

        return `Freq: ${freq.toFixed(1)}Hz | Vol: ${vol.toFixed(1)}dB | Filter: ${filterFreq.toFixed(0)}Hz`;
    }

    stop() {
        if (this.synth) {
            this.synth.triggerRelease();
        }
    }
}

// Globale SoundSynth Instanz
let soundSynth = null;
