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

const uiDefaults = {
    size:  ['800px', '200px'],
    range: [36, 60],
    colors: {
        whiteKey: 'white',
        blackKey: 'black',
        whiteKeyHighlight: 'aqua',
        blackKeyHighlight: 'aqua',
        blackKeyBorder: 'gray',
        whiteKeyBorder: 'gray',
    },
}


class UIEmiter extends EventEmitter {
    constructor() {
        super();
    }

    noteOn(key) {
        this.emit('noteOn', { note: key.id });
    }

    noteOff(key) {
        this.emit('noteOff', { note: key.id });
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
        this.mediaQueries = mediaQueries;

        this._initializeColors(colors);

        // ensure range starts and ends with a white key.
        this._correctRange();

        window.addEventListener('mousedown', () => {
            this.mouseState = MOUSEDOWN;
        });

        window.addEventListener('mouseup', () => {
            this.mouseState = MOUSEUP;
        });

        this.pianoContainer = document.getElementById(this.target);

        // array for externally triggerring keys? performance increase from getting by id
        // may be negligable: https://stackoverflow.com/questions/1716266/javascript-document-getelementbyid-slow-performance/1716873#1716873
        // it is an old post...
        this.keys = [];

        this._buildUI(target, size);

        // media queries may reference ui, so register them last
        this._registerMediaQueries();
    }


    on(eventName, callback) {
        return this.emitter.on(eventName, callback);
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
                            bk.style.borderColor = this.colors[k];
                        }
                        break;
                    case 'whiteKeyBorder':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.style.borderColor = this.colors[k];
                        }
                        break;
                }
            }
        }
    }


    // TODO: add support for velocity
    setKeyActive(number) {
        let key = this.keys[number - this.range[0]];
        if (key) {
            this._setActive(key);
        }
    }

    setKeyInactive(number) {
        let key = this.keys[number - this.range[0]];
        if (key) {
            this._setInactive(key);
        }
    }



    setSize(size) {
        this.size = size.slice();
        this.keyContainer.style.width = `${this.size[0]}`;
        this.keyContainer.style.height = `${this.size[1]}`;
        this._resizeBlackKeys();
    }

    setRange(range) {
        this.range = range.slice();
        this._removeAllKeys();
        this._createKeys();
    }


    // Calling setSize and setRange separately would call resizeBlackKeys twice.
    // This method exists to avoid that unnecessary double invocation.
    setSizeAndRange(size, range) {
        this.size = size.slice();
        this.range = range.slice();
        this._removeAllKeys();
        this.keyContainer.style.width = `${this.size[0]}`;
        this.keyContainer.style.height = `${this.size[1]}`;
        this._createKeys();
    }


    _removeAllKeys() {
        while (this.whiteKeyContainer.firstChild) {
            this.whiteKeyContainer.lastChild.remove();
        }
        while (this.blackKeyContainer.firstChild) {
            this.blackKeyContainer.lastChild.remove();
        }
        this.keys = [];
    }


    _registerMediaQueries() {
        for (let query in this.mediaQueries) {

            this.mediaQueries[query] = this.mediaQueries[query].bind(this);
            let q = matchMedia(query);

            // test if already matches
            this.mediaQueries[query](q);

            // then add listener
            q.addListener(
                this.mediaQueries[query]
            );
        }
    }


    _initializeColors(colors) {
        for (let k in defaultColors) {
            if (colors && colors[k]) {
                this.colors[k] = colors[k];
            } else {
                this.colors[k] = defaultColors[k];
            }
        }
    }


    _correctRange() {
        let whiteKeyIndexes = [0, 2, 4, 5, 7, 9, 11];
        if (!whiteKeyIndexes.includes(this.range[0] % 12)) {
            this.range[0] = Math.max( this.range[0] - 1, 0);
        }

        if (!whiteKeyIndexes.includes(this.range[1] % 12)) {
            this.range[1] = Math.max( this.range[1] - 1, 0);
        }
    }


    _createKeyContainer(className) {
        let template = document.createElement('template');
        template.innerHTML = `<div class="${className}"></div>`;
        return template.content.firstChild;
    }


    _createKey(id, className, keyColor, highlightColor, borderColor) {
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


    _createContainers() {
        this.keyContainer = this._createKeyContainer(styles.keyContainer);
        this.keyContainer.style.width = `${this.size[0]}`;
        this.keyContainer.style.height = `${this.size[1]}`;

        this.blackKeyContainer = this._createKeyContainer(styles.blackKeyContainer);
        this.whiteKeyContainer = this._createKeyContainer(styles.whiteKeyContainer);

        this.keyContainer.appendChild(this.blackKeyContainer);
        this.keyContainer.appendChild(this.whiteKeyContainer);
        this.pianoContainer.appendChild(this.keyContainer);
    }


    _buildUI() {
        this._createContainers();
        this._createKeys();
    }


    _createKeys() {
        let keyPattern = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];

        for (let i = this.range[0]; i < this.range[1] + 1; i++) {

            if (keyPattern[i % 12] === 'w') {
                let newKey = this._createKey(
                    i, styles.whiteKey,
                    this.colors.whiteKey,
                    this.colors.whiteKeyHighlight,
                    this.colors.whiteKeyBorder
                );
                this._registerEventListeners(newKey);
                this.whiteKeyContainer.appendChild(newKey);
                this.keys.push(newKey);
            } else {
                let newKey = this._createKey(
                    i,
                    styles.blackKey,
                    this.colors.blackKey,
                    this.colors.blackKeyHighlight,
                    this.colors.blackKeyBorder
                );
                this._registerEventListeners(newKey);
                this.blackKeyContainer.appendChild(newKey);
                this.keys.push(newKey);
            }

            if (i % 12 === 4 || i % 12 === 11) {
                let ghostKey = document.createElement('template');
                ghostKey.innerHTML = `<div class="${styles.ghostKey}"></div>`;
                this.blackKeyContainer.appendChild(ghostKey.content.firstChild);
            }
        }

        this._resizeBlackKeys();
    }


    _resizeBlackKeys() {
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
    }


    _registerEventListeners(key) {
        key.addEventListener('mouseover', (e) => {
            e.preventDefault();
            this._mouseOverKey(e);
        });
        key.addEventListener('mouseout', (e) => {
            e.preventDefault();
            this._mouseOutKey(e);
        });
        key.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this._mouseDownKey(e);
        });
        key.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this._mouseUpKey(e);
        });

        key.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }


    _mouseDownKey(e) {
        this._setActive(e.target);
    }


    _mouseUpKey(e) {
        this._setInactive(e.target);
    }


    _mouseOverKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this._setActive(e.target);
        }
    }


    _mouseOutKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this._setInactive(e.target);
        }
    }


    _setActive(pianoKey) {
        this._setInactive(this.activePianoKey)
        this.activePianoKey = pianoKey;
        this.activePianoKey.style.backgroundColor = this.activePianoKey.getAttribute('highlightColor');
        this.emitter.noteOn(this.activePianoKey);
    }


    _setInactive(pianoKey) {
        if (pianoKey) {
            pianoKey.style.backgroundColor = pianoKey.getAttribute('primaryColor');
            this.emitter.noteOff(pianoKey);
        }
    }
}