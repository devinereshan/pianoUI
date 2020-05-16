import styles from './PianoUI.module.css';
const EventEmitter = require('events');

const MOUSEUP = 0;
const MOUSEDOWN = 1;

const defaultColors = {
    whiteKey: 'white',
    blackKey: 'black',
    whiteKeyHighlight: 'aqua',
    blackKeyHighlight: 'aqua',
    blackKeyBorder: 'gray',
    whiteKeyBorder: 'gray',
}

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
    constructor(target, size, range, colors, mediaQueries) {
        this.emitter = new UIEmiter();
        this.target = target;
        this.size = size.slice();
        this.range = range.slice(); // [lowNote, highNote] - inclusive
        this.mouseState = MOUSEUP;
        this.colors = {};
        this.initializeColors(colors);
        this.mediaQueries = mediaQueries;
        this.registerMediaQueries();

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

    registerMediaQueries() {
        for (let query in this.mediaQueries) {
            console.log('media query');
            matchMedia(query).addListener(
                this.mediaQueries[query].bind(this)
            );
        }
    }

    initializeColors(colors) {
        for (let k in defaultColors) {
            if (colors && colors[k]) {
                this.colors[k] = colors[k];
            } else {
                this.colors[k] = defaultColors[k];
            }
        }
    }

    setColors(colors) {
        for (let k in colors) {
            // only update value if it is a valid key and is different from current value
            if (this.colors[k] && this.colors[k] !== colors[k]) {
                this.colors[k] = colors[k];

                switch(k) {
                    case 'whiteKey':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.setAttribute('primaryColor', this.colors[k]);
                            wk.style.backgroundColor = this.colors[k];
                        }
                        break;
                    case 'blackKey':
                        for (let bk of this.blackKeyContainer.children) {
                            bk.setAttribute('primaryColor', this.colors[k]);
                            bk.style.backgroundColor = this.colors[k];
                        }
                        break;
                    case 'whiteKeyHighlight':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.setAttribute('highlightColor', this.colors[k]);
                        }
                        break;
                    case 'blackKeyHighlight':
                        for (let bk of this.blackKeyContainer.children) {
                            bk.setAttribute('highlightColor', this.colors[k]);
                        }
                        break;
                    case 'blackKeyBorder':
                        for (let bk of this.blackKeyContainer.children) {
                            bk.style.border = this.colors[k];
                        }
                        break;
                    case 'whiteKeyBorder':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.style.border = this.colors[k];
                        }
                        break;
                }
            }
        }
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


    createKey(id, className, keyColor, highlightColor, borderColor) {
        let template = document.createElement('template');
        template.innerHTML = `
            <div
                id="${id}"
                class="${className}"
                primaryColor="${keyColor}"
                highlightColor="${highlightColor}"
                style="
                    background-color: ${keyColor};
                    border: 1px solid ${borderColor}
                "
            >
            </div>
        `.replace(/\s+/g, ' ').trim();

        return template.content.firstChild;
    }


    buildUI() {
        this.keyContainer = this.createKeyContainer(styles.keyContainer);
        this.keyContainer.style.width = `${this.size[0]}`;
        this.keyContainer.style.height = `${this.size[1]}`;

        this.blackKeyContainer = this.createKeyContainer(styles.blackKeyContainer);
        this.whiteKeyContainer = this.createKeyContainer(styles.whiteKeyContainer);

        let keyPattern = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];

        for (let i = this.range[0]; i < this.range[1] + 1; i++) {

            if (keyPattern[i % 12] === 'w') {
                let newKey = this.createKey(
                    i, styles.whiteKey,
                    this.colors.whiteKey,
                    this.colors.whiteKeyHighlight,
                    this.colors.whiteKeyBorder
                );
                this.registerEventListeners(newKey);
                this.whiteKeyContainer.appendChild(newKey);
            } else {
                let newKey = this.createKey(
                    i,
                    styles.blackKey,
                    this.colors.blackKey,
                    this.colors.blackKeyHighlight,
                    this.colors.blackKeyBorder
                );
                this.registerEventListeners(newKey);
                this.blackKeyContainer.appendChild(newKey);
            }

            if (i % 12 === 4 || i % 12 === 11) {
                let ghostKey = document.createElement('template');
                ghostKey.innerHTML = `<div class="${styles.ghostKey}"></div>`;
                this.blackKeyContainer.appendChild(ghostKey.content.firstChild);
            }
        }

        let width = this.size[0].split(/([0-9]+)/).slice(1);
        let blackKeyMargin;

        // percentage values are relative to parent container, so must be calculated separately
        if (width[1] !== '%') {
            blackKeyMargin = (Number(width[0]) / this.whiteKeyContainer.children.length) / 8;
        } else {
            blackKeyMargin = (Number(width[0]) / this.whiteKeyContainer.children.length) / (8 * (Number(width[0]) / 100));
        }

        for (let bk of this.blackKeyContainer.children) {
            bk.style.marginLeft = `${blackKeyMargin}${width[1]}`;
            bk.style.marginRight = `${blackKeyMargin}${width[1]}`;
        };

        this.blackKeyContainer.style.paddingLeft = `${blackKeyMargin * 4}${width[1]}`;
        this.blackKeyContainer.style.paddingRight = `${blackKeyMargin * 4}${width[1]}`;

        this.keyContainer.appendChild(this.blackKeyContainer);
        this.keyContainer.appendChild(this.whiteKeyContainer);
        this.pianoContainer.appendChild(this.keyContainer);
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