import styles from './PianoUI.module.css';
const EventEmitter = require('events');

const MOUSEUP = 0;
const MOUSEDOWN = 1;

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
    whiteKeyBorderWidth: '1px',
    blackKeyBorderWidth: '1px',
    blackKeyWidthRatio: 0.75,
    blackKeyHeight: '55%',
    mouseVelocity: 127,
}


class UIEmiter extends EventEmitter {
    constructor() {
        super();
    }

    noteOn(key, vel, eSource) {
        this.emit('noteOn', {
            note: key.getAttribute('keyID'),
            velocity: vel,
            eventSource: eSource,
        });
    }

    noteOff(key, vel, eSource) {
        this.emit('noteOff', {
            note: key.getAttribute('keyID'),
            velocity: vel,
            eventSource: eSource,
        });
    }
}


export class Piano {
    constructor(target, options, mediaQueries) {

        this.pianoContainer = document.querySelector(target);
        if (this.pianoContainer === null) {
            throw new Error(`Invalid 'target' parameter in Piano constructor. Could not find element matching '${target}'`);
        }

        this.options = {};
        this.emitter = new UIEmiter();
        this.options.colors = {};

        if (options === undefined) {
            this._parseOptions(uiDefaults);
        } else {
            this._parseOptions(options);
        }

        this.mouseState = MOUSEUP;
        this.mediaQueries = mediaQueries;

        // ensure range starts and ends with a white key.
        this._correctRange();

        window.addEventListener('mousedown', () => {
            this.mouseState = MOUSEDOWN;
        });

        window.addEventListener('mouseup', () => {
            this.mouseState = MOUSEUP;
        });

        this.keys = [];

        this._buildUI(target, this.options.size);

        // media queries may reference ui, so register them last
        this.setMediaQueries(this.mediaQueries);
    }


    on(eventName, callback) {
        return this.emitter.on(eventName, callback);
    }


    setColors(colors) {
        for (let k in colors) {
            // only update value if it is a valid key and is different from current value
            if (this.options.colors[k] && this.options.colors[k] !== colors[k]) {
                this.options.colors[k] = colors[k];

                switch(k) {
                    case 'whiteKey':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.setAttribute('primaryColor', this.options.colors[k]);
                            wk.style.backgroundColor = this.options.colors[k];
                        }
                        break;
                    case 'blackKey':
                        for (let bk of this.blackKeyContainer.children) {
                            bk.setAttribute('primaryColor', this.options.colors[k]);
                            bk.style.backgroundColor = this.options.colors[k];
                        }
                        break;
                    case 'whiteKeyHighlight':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.setAttribute('highlightColor', this.options.colors[k]);
                        }
                        break;
                    case 'blackKeyHighlight':
                        for (let bk of this.blackKeyContainer.children) {
                            bk.setAttribute('highlightColor', this.options.colors[k]);
                        }
                        break;
                    case 'blackKeyBorder':
                        for (let bk of this.blackKeyContainer.children) {
                            bk.style.borderColor = this.options.colors[k];
                        }
                        break;
                    case 'whiteKeyBorder':
                        for (let wk of this.whiteKeyContainer.children) {
                            wk.style.borderColor = this.options.colors[k];
                        }
                        break;
                }
            }
        }
    }


    /**
     * Return the value of this.options.colors[identifier] if it exists
     * @param {string} identifier
     */
    getColor(identifier) {
        if (this.options.colors[identifier]) {
            return this.options.colors[identifier];
        }
    }


    setKeyActive(number, velocity = this.options.mouseVelocity) {
        let key = this.keys[number - this.options.range[0]];
        if (key) {
            this._setActive(key, velocity, 'external');
        }
    }


    setKeyInactive(number, velocity = this.options.mouseVelocity) {
        let key = this.keys[number - this.options.range[0]];
        if (key) {
            this._setInactive(key, velocity, 'external');
        }
    }


    setSize(size) {
        this.options.size = size.slice();
        this.keyContainer.style.width = `${this.options.size[0]}`;
        this.keyContainer.style.height = `${this.options.size[1]}`;
        this._resizeBlackKeys();
    }


    getSize() {
        return this.options.size.slice();
    }


    setRange(range) {
        this.options.range = range.slice();
        this._removeAllKeys();
        this._createKeys();
    }


    getRange() {
        return this.options.range.slice();
    }


    // Calling setSize and setRange separately would call resizeBlackKeys twice.
    // This method exists to avoid that unnecessary double invocation.
    setSizeAndRange(size, range) {
        this.options.size = size.slice();
        this.options.range = range.slice();
        this._removeAllKeys();
        this.keyContainer.style.width = `${this.options.size[0]}`;
        this.keyContainer.style.height = `${this.options.size[1]}`;
        this._createKeys();
    }


    setMouseVelocity(velocity) {
        this.options.mouseVelocity = velocity;
    }


    getMouseVelocity() {
        return this.options.mouseVelocity;
    }


    setBlackKeyWidthRatio(ratio) {
        this.options.blackKeyWidthRatio = ratio;
        this._resizeBlackKeys();
    }


    getBlackKeyWidthRatio() {
        return this.options.blackKeyWidthRatio;
    }


    setBlackKeyHeight(height) {
        this.options.blackKeyHeight = height;
        this.blackKeyContainer.style.height = this.options.blackKeyHeight;
    }


    getBlackKeyHeight() {
        return this.options.blackKeyHeight;
    }


    setMediaQueries(mediaQueries) {
        for (let query in mediaQueries) {

            this.mediaQueries[query] = mediaQueries[query].bind(this);
            let q = matchMedia(query);

            // test if already matches
            this.mediaQueries[query](q);

            // then add listener
            q.addListener(
                this.mediaQueries[query]
            );
        }
    }


    setBlackKeyBorderWidth(width) {
        this.options.blackKeyBorderWidth = width;
        for (let bk of this.blackKeyContainer.children) {
            bk.style.borderWidth = this.options.blackKeyBorderWidth;
        }
    }


    getBlackKeyBorderWidth() {
        return this.options.blackKeyBorderWidth;
    }


    setWhiteKeyBorderWidth(width) {
        this.options.whiteKeyBorderWidth = width;
        for (let wk of this.whiteKeyContainer.children) {
            wk.style.borderWidth = this.options.whiteKeyBorderWidth;
        }
    }


    getWhiteKeyBorderWidth() {
        return this.options.whiteKeyBorderWidth;
    }


    _parseOptions(options) {
        this.options.size = options.size ? options.size.slice() : uiDefaults.size.slice();
        this.options.range = options.range ? options.range.slice() : uiDefaults.range.slice();

        if (options.colors) {
            this._initializeColors(options.colors);
        } else {
            this._initializeColors(uiDefaults.colors);
        }

        this.options.whiteKeyBorderWidth = options.whiteKeyBorderWidth ? options.whiteKeyBorderWidth : uiDefaults.whiteKeyBorderWidth;

        this.options.blackKeyBorderWidth = options.blackKeyBorderWidth ? options.blackKeyBorderWidth : uiDefaults.blackKeyBorderWidth;
        this.options.blackKeyWidthRatio = options.blackKeyWidthRatio !== undefined ? options.blackKeyWidthRatio : uiDefaults.blackKeyWidthRatio;
        this.options.blackKeyHeight = options.blackKeyHeight !== undefined ? options.blackKeyHeight : uiDefaults.blackKeyHeight;

        this.options.mouseVelocity = options.mouseVelocity !== undefined ? options.mouseVelocity : uiDefaults.mouseVelocity;
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


    _initializeColors(colors) {
        for (let k in uiDefaults.colors) {
            if (colors && colors[k]) {
                this.options.colors[k] = colors[k];
            } else {
                this.options.colors[k] = uiDefaults.colors[k];
            }
        }
    }


    _correctRange() {
        let whiteKeyIndexes = [0, 2, 4, 5, 7, 9, 11];
        if (!whiteKeyIndexes.includes(this.options.range[0] % 12)) {
            this.options.range[0] = Math.max( this.options.range[0] - 1, 0);
        }

        if (!whiteKeyIndexes.includes(this.options.range[1] % 12)) {
            this.options.range[1] = Math.max( this.options.range[1] - 1, 0);
        }
    }


    _createKeyContainer(className) {
        let template = document.createElement('template');
        template.innerHTML = `<div class="${className}"></div>`;
        return template.content.firstChild;
    }


    _createKey(keyID, className, keyColor, highlightColor, borderColor, borderWidth) {
        let template = document.createElement('template');
        template.innerHTML = `
            <div
                keyID="${keyID}"
                class="${className}"
                primaryColor="${keyColor}"
                highlightColor="${highlightColor}"
                style="
                    background-color: ${keyColor};
                    border: ${borderWidth} solid ${borderColor}
                "
            >
            </div>
        `.replace(/\s+/g, ' ').trim();

        return template.content.firstChild;
    }


    _createContainers() {
        this.keyContainer = this._createKeyContainer(styles.keyContainer);
        this.keyContainer.style.width = `${this.options.size[0]}`;
        this.keyContainer.style.height = `${this.options.size[1]}`;

        this.blackKeyContainer = this._createKeyContainer(styles.blackKeyContainer);
        this.blackKeyContainer.style.height = this.options.blackKeyHeight;
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

        for (let i = this.options.range[0]; i < this.options.range[1] + 1; i++) {

            if (keyPattern[i % 12] === 'w') {
                let newKey = this._createKey(
                    i, styles.whiteKey,
                    this.options.colors.whiteKey,
                    this.options.colors.whiteKeyHighlight,
                    this.options.colors.whiteKeyBorder,
                    this.options.whiteKeyBorderWidth
                );
                this._registerEventListeners(newKey);
                this.whiteKeyContainer.appendChild(newKey);
                this.keys.push(newKey);
            } else {
                let newKey = this._createKey(
                    i,
                    styles.blackKey,
                    this.options.colors.blackKey,
                    this.options.colors.blackKeyHighlight,
                    this.options.colors.blackKeyBorder,
                    this.options.blackKeyBorderWidth
                );
                this._registerEventListeners(newKey);
                this.blackKeyContainer.appendChild(newKey);
                this.keys.push(newKey);
            }

            if ((i % 12 === 4 || i % 12 === 11) && i < this.options.range[1]) {
                let ghostKey = document.createElement('template');
                ghostKey.innerHTML = `<div class="${styles.ghostKey}" style="border: ${this.options.blackKeyBorderWidth} solid #000000"></div>`;
                this.blackKeyContainer.appendChild(ghostKey.content.firstChild);
            }
        }

        this._resizeBlackKeys();
    }


    _resizeBlackKeys() {
        let width = this.options.size[0].split(/([0-9]+)/).slice(1);
        let whiteKeyWidth = Number(width[0]) / this.whiteKeyContainer.children.length

        let blackKeyMargin;
        let marginRatio;

        if (this.options.blackKeyWidthRatio === 1) {
            blackKeyMargin = 0;
        } else {
            marginRatio =  (1 - this.options.blackKeyWidthRatio) / 2;
            if (width[1] !== '%') {
                blackKeyMargin = whiteKeyWidth * marginRatio;
            } else {
                blackKeyMargin = (whiteKeyWidth) / ((Number(width[0]) / 100) / marginRatio);
            }
        }

        for (let bk of this.blackKeyContainer.children) {
            bk.style.marginLeft = `${blackKeyMargin}${width[1]}`;
            bk.style.marginRight = `${blackKeyMargin}${width[1]}`;
        };

        if (blackKeyMargin === 0) {
            this.blackKeyContainer.style.paddingLeft = `${whiteKeyWidth / 2}${width[1]}`;
            this.blackKeyContainer.style.paddingRight = `${whiteKeyWidth / 2}${width[1]}`;
        } else {
            this.blackKeyContainer.style.paddingLeft = `${blackKeyMargin / (marginRatio * 2)}${width[1]}`;
            this.blackKeyContainer.style.paddingRight = `${blackKeyMargin / (marginRatio * 2)}${width[1]}`;
        }
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
        this._setActive(e.target, this.options.mouseVelocity, 'mouseDown');
    }


    _mouseUpKey(e) {
        this._setInactive(e.target, this.options.mouseVelocity, 'mouseUp');
    }


    _mouseOverKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this._setActive(e.target, this.options.mouseVelocity, 'mouseOver');
        }
    }


    _mouseOutKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this._setInactive(e.target, this.options.mouseVelocity, 'mouseOut');
        }
    }


    _setActive(pianoKey, velocity, eventSource) {
        pianoKey.style.backgroundColor = pianoKey.getAttribute('highlightColor');
        this.emitter.noteOn(pianoKey, velocity, eventSource);
    }


    _setInactive(pianoKey, velocity, eventSource) {
        if (pianoKey) {
            pianoKey.style.backgroundColor = pianoKey.getAttribute('primaryColor');
            this.emitter.noteOff(pianoKey, velocity, eventSource);
        }
    }
}