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
        this.size = size.slice();
        this.range = range.slice(); // [lowNote, highNote] - inclusive
        this.mouseState = MOUSEUP;

        // ensure range starts and ends with a white key.
        this.correctRange();

        window.addEventListener('mousedown', () => {
            this.mouseState = MOUSEDOWN;
        });

        window.addEventListener('mouseup', () => {
            this.mouseState = MOUSEUP;
        });

        this.pianoContainer = document.getElementById(this.target);

        this.buildUI(target, size);
    }

    correctRange() {
        let whiteKeyIndexes = [0, 2, 4, 5, 7, 9, 11];
        if (!whiteKeyIndexes.includes(this.range[0] % 12)) {
            this.range[0] = Math.max( this.range[0] - 1, 0);
        }

        if (!whiteKeyIndexes.includes(this.range[1] % 12)) {
            this.range[1] = Math.max( this.range[1] - 1, 0);
        }
    }

    on(eventName, callback) {
        return this.emitter.on(eventName, callback);
    }


    createKeyContainer(className) {
        let template = document.createElement('template');
        template.innerHTML = `<div class="${className}"></div>`;
        return template.content.firstChild;
    }


    createKey(id, className, keyColor, highlightColor) {
        let template = document.createElement('template');
        template.innerHTML = `
            <div
                id="${id}"
                class="${className}"
                primaryColor="${keyColor}"
                highlightColor="${highlightColor}"
                style="background-color: ${keyColor}"
            >
            </div>
        `.replace(/\s+/g, ' ').trim();

        return template.content.firstChild;
    }


    buildUI() {
        let keyContainer = this.createKeyContainer(styles.keyContainer);
        keyContainer.style.width = `${this.size[0]}px`;
        keyContainer.style.height = `${this.size[1]}px`;

        let blackKeyContainer = this.createKeyContainer(styles.blackKeyContainer);
        let whiteKeyContainer = this.createKeyContainer(styles.whiteKeyContainer);

        let keyPattern = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];

        for (let i = this.range[0]; i < this.range[1] + 1; i++) {

            if (keyPattern[i % 12] === 'w') {
                let newKey = this.createKey(i, styles.whiteKey, 'white', 'aqua');
                this.registerEventListeners(newKey);
                whiteKeyContainer.appendChild(newKey);
            } else {
                let newKey = this.createKey(i, styles.blackKey, 'black', 'aqua');
                this.registerEventListeners(newKey);
                blackKeyContainer.appendChild(newKey);
            }

            if (i % 12 === 4 || i % 12 === 11) {
                let ghostKey = document.createElement('template');
                ghostKey.innerHTML = `<div class="${styles.ghostKey}"></div>`;
                blackKeyContainer.appendChild(ghostKey.content.firstChild);
            }
        }

        let blackKeyMargin = (this.size[0] / whiteKeyContainer.children.length) / 8;

        for (let bk of blackKeyContainer.children) {
            bk.style.marginLeft = `${blackKeyMargin}px`
            bk.style.marginRight = `${blackKeyMargin}px`
        };

        blackKeyContainer.style.paddingLeft = `${blackKeyMargin * 4}px`;
        blackKeyContainer.style.paddingRight = `${blackKeyMargin * 4}px`;

        keyContainer.appendChild(blackKeyContainer);
        keyContainer.appendChild(whiteKeyContainer);
        this.pianoContainer.appendChild(keyContainer);
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
        this.activePianoKey.style.backgroundColor = this.activePianoKey.getAttribute('highlightColor');
    }


    setInactive(pianoKey) {
        if (pianoKey) {
            pianoKey.style.backgroundColor = pianoKey.getAttribute('primaryColor');
        }
    }
}