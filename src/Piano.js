import Synth from 'tone/Tone/instrument/Synth';
import PianoUI from './PianoUI';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


export default class Piano {
    constructor(targetElement, settings, mediaQueries) {
        this.pianoUI = new PianoUI(targetElement, settings, mediaQueries);
        this.synth = new Synth().toMaster();
        this.connectSynthtoUI();
    }

    connectSynthtoUI() {
        this.pianoUI.on('noteOn', (e) => {
            console.log(e);
            let velocity = e.velocity > 0 ? e.velocity/127 : 0;
            let note = notes[e.note % 12];
            let octave = Math.floor(e.note / 12);
            note += octave;
            this.synth.triggerAttack(note, undefined, velocity);
        });

        this.pianoUI.on('noteOff', (e) => {
            console.log(e);
            this.synth.triggerRelease();
        });
    }

    setColors(colors) {
        this.pianoUI.setColors(colors);
    }
}