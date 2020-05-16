import Synth from 'tone/Tone/instrument/Synth';
import PianoUI from './PianoUI';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


export default class Piano {
    constructor(targetElement, size, range, colors, mediaQueries) {
        this.pianoUI = new PianoUI(targetElement, size, range, colors, mediaQueries);
        this.synth = new Synth().toMaster();
        this.connectSynthtoUI();
    }

    connectSynthtoUI() {
        this.pianoUI.on('noteOn', (e) => {
            let note = notes[e.note % 12];
            let octave = Math.floor(e.note / 12);
            note += octave;
            this.synth.triggerAttack(note);
        });

        this.pianoUI.on('noteOff', () => {
            this.synth.triggerRelease();
        });
    }

    setColors(colors) {
        this.pianoUI.setColors(colors);
    }
}