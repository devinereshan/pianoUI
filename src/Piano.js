import Synth from 'tone/Tone/instrument/Synth';
const EventEmitter = require('events');

const MOUSEUP = 0;
const MOUSEDOWN = 1;
const notes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];


export default class Piano {
    constructor(targetElement) {
        // this.name = "piano";
        // this.elem = document.createElement('div');
        this.pianoUI = new PianoUI(targetElement);
        this.synth = new Synth().toMaster();
        this.connectSynthtoUI();
    }

    connectSynthtoUI() {
        this.pianoUI.on('noteOn', (e) => {
            this.synth.triggerAttack(notes[e.note]);
        });

        this.pianoUI.on('noteOff', (e) => {
            this.synth.triggerRelease();
        });


    }
}

class PianoUI extends EventEmitter {
    constructor(target) {
        super();
        this.buildUI(target);
    }

    buildUI(target) {
        this.keyContainer = document.createElement('div');
        this.keyContainer.setAttribute('id', 'piano');

        this.keyContainer.style.width = '500px';
        this.keyContainer.style.height = '125px';

        this.pianoContainer = document.getElementById(target);

        this.mouseState = MOUSEUP;

        window.addEventListener('mousedown', () => {
            this.mouseState = MOUSEDOWN;
        });

        window.addEventListener('mouseup', () => {
            this.mouseState = MOUSEUP;
        });

        this.whiteKeys = []
        for (let i = 0; i < 8; i++) {
            this.whiteKeys[i] = document.createElement('div');
            this.whiteKeys[i].setAttribute('class', 'key');
            this.whiteKeys[i].setAttribute('id', `${i}`);

            this.whiteKeys[i].addEventListener('mouseover', (e) => {
                e.preventDefault();
                this.mouseOverKey(e);
            });
            this.whiteKeys[i].addEventListener('mouseout', (e) => {
                e.preventDefault();
                this.mouseOutKey(e);
            });
            this.whiteKeys[i].addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.mouseDownKey(e);
            });
            this.whiteKeys[i].addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.mouseUpKey(e);
            });

            // prevent keys from being dragged
            this.whiteKeys[i].addEventListener('dragstart', (e) => {
                e.preventDefault();
            })

            this.keyContainer.appendChild(this.whiteKeys[i]);
        }

        this.pianoContainer.appendChild(this.keyContainer);
    }


    mouseDownKey(e) {
        this.setActive(e.target);
        this.emit('noteOn', { note: e.target.id });
    }

    mouseUpKey(e) {
        this.setInactive(e.target);
        this.emit('noteOff', { note: e.target.id });
    }

    mouseOverKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this.setActive(e.target);
            this.emit('noteOn', { note: e.target.id });
        }
    }

    mouseOutKey(e) {
        this.setInactive(e.target);
        if (this.mouseState === MOUSEDOWN) {
            this.emit('noteOff', { note: e.target.id });
        }
    }

    setActive(pianoKey) {
        this.setInactive(this.activePianoKey)
        this.activePianoKey = pianoKey;
        this.activePianoKey.style.backgroundColor = 'pink';
    }

    setInactive(pianoKey) {
        if (pianoKey) {
            pianoKey.style.backgroundColor = 'white';
        }
    }

}

