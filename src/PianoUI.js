import styles from './PianoUI.module.css';
const EventEmitter = require('events');

const MOUSEUP = 0;
const MOUSEDOWN = 1;

class UIEmiter extends EventEmitter {
    constructor() {
        super();
    }

    noteOn(e) {
        this.emit('noteOn', { note: e.target.id });
    }

    noteOff(e) {
        this.emit('noteOff', { note: e.target.id });
    }
}

export default class PianoUI {
    constructor(target, size, range) {
        this.emitter = new UIEmiter();
        this.target = target;
        this.size = size;
        this.mouseState = MOUSEUP;

        // [lowNote, highNote] - inclusive
        // ensure range starts and ends with a white key.
        let whiteKeyIndexes = [0, 2, 4, 5, 7, 9, 11];
        if (!whiteKeyIndexes.includes(range[0] % 12)) {
            console.log(`${range[0]} not white key`)
            range[0] = Math.max( range[0] - 1, 0);
        }

        if (!whiteKeyIndexes.includes(range[1] % 12)) {
            console.log(`${range[1]} not white key`)
            range[1] = Math.max( range[1] - 1, 0);
        }

        this.range = range;

        window.addEventListener('mousedown', () => {
            this.mouseState = MOUSEDOWN;
        });

        window.addEventListener('mouseup', () => {
            this.mouseState = MOUSEUP;
        });

        this.buildUI(target, size);
    }


    on(eventName, callback) {
        return this.emitter.on(eventName, callback);
    }


    buildUI() {
        this.pianoContainer = document.getElementById(this.target);
        let keyContainer = document.createElement('template');
        keyContainer.innerHTML = `<div class="${styles.keyContainer}"></div>`

        let blackKeyContainer = document.createElement('template');
        blackKeyContainer.innerHTML = `<div class="${styles.blackKeys}"></div>`

        let whiteKeyContainer = document.createElement('template');
        whiteKeyContainer.innerHTML = `<div class="${styles.whiteKeys}"></div>`

        keyContainer.content.firstChild.style.width = `${this.size[0]}px`;
        keyContainer.content.firstChild.style.height = `${this.size[1]}px`;


        let whiteKeyTemplate = `<div class="${styles.whiteKey}" primaryColor="white" style="background-color: white"></div>`;

        let blackKeyTemplate = `<div class="${styles.blackKey}" primaryColor="black" style="background-color: black"></div>`;

        let ghostKeyTemplate = `<div class="${styles.ghostKey}"></div>`;

        let keyPattern = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];

        for (let i = this.range[0]; i < this.range[1] + 1; i++) {

            if (keyPattern[i % 12] === 'w') {
                let newKey = document.createElement('template');

                newKey.innerHTML = whiteKeyTemplate.trim();
                newKey.content.firstChild.setAttribute('id', `${i}`)
                this.registerEventListeners(newKey.content.firstChild);

                whiteKeyContainer.content.firstChild.appendChild(newKey.content.firstChild);
            } else {
                let newKey = document.createElement('template');
                newKey.innerHTML = blackKeyTemplate.trim();
                newKey.content.firstChild.setAttribute('id', `${i}`)

                this.registerEventListeners(newKey.content.firstChild);

                blackKeyContainer.content.firstChild.appendChild(newKey.content.firstChild);
            }

            if (i % 12 === 4 || i % 12 === 11) {
                let ghostKey = document.createElement('template');
                ghostKey.innerHTML = ghostKeyTemplate.trim();
                blackKeyContainer.content.firstChild.appendChild(ghostKey.content.firstChild);
            }
        }


        let blackKeyMargin = (this.size[0] / whiteKeyContainer.content.firstChild.children.length) / 8;


        for (let bk of blackKeyContainer.content.firstChild.children) {
            bk.style.marginLeft = `${blackKeyMargin}px`
            bk.style.marginRight = `${blackKeyMargin}px`
        };

        blackKeyContainer.content.firstChild.style.paddingLeft = `${blackKeyMargin * 4}px`;
        blackKeyContainer.content.firstChild.style.paddingRight = `${blackKeyMargin * 4}px`;


        keyContainer.content.firstChild.appendChild(blackKeyContainer.content.firstChild);
        keyContainer.content.firstChild.appendChild(whiteKeyContainer.content.firstChild);
        this.pianoContainer.appendChild(keyContainer.content.firstChild);

    }

    registerEventListeners(key) {
        key.addEventListener('mouseover', (e) => {
            e.preventDefault();
            this.mouseOverKey(e);
        });
        key.addEventListener('mouseout', (e) => {
            e.preventDefault();
            this.mouseOutKey(e);
        });
        key.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.mouseDownKey(e);
        });
        key.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.mouseUpKey(e);
        });

        key.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }


    mouseDownKey(e) {
        this.setActive(e.target);
        this.emitter.noteOn(e);
    }

    mouseUpKey(e) {
        this.setInactive(e.target);
        this.emitter.noteOff(e);
    }

    mouseOverKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this.setActive(e.target);
            this.emitter.noteOn(e);
        }
    }

    mouseOutKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this.setInactive(e.target);
            this.emitter.noteOff(e);
        }
    }

    setActive(pianoKey) {
        this.setInactive(this.activePianoKey)
        this.activePianoKey = pianoKey;
        this.activePianoKey.style.backgroundColor = 'aqua';
    }

    setInactive(pianoKey) {
        if (pianoKey) {
            pianoKey.style.backgroundColor = pianoKey.getAttribute('primaryColor');
        }
    }
}