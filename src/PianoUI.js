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
        // super();
        this.emitter = new UIEmiter();

        this.target = target;

        this.size = size;

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

        this.mouseState = MOUSEUP;

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

        this.keyContainer = document.createElement('div');
        this.whiteKeyContainer = document.createElement('div');
        this.whiteKeyContainer.setAttribute('id', 'white-keys');

        this.blackKeyContainer = document.createElement('div');
        this.blackKeyContainer.setAttribute('id', 'black-keys');




        // this.keyContainer = document.createElement('div');
        this.keyContainer.style.width = `${this.size[0]}px`;
        this.keyContainer.style.height = `${this.size[1]}px`;
        this.keyContainer.style.position = 'relative';
        this.keyContainer.style.border = '1px solid green';

        // this.whiteKeyContainer = document.createElement('div');
        // this.whiteKeyContainer.setAttribute('id', 'white-keys');
        this.whiteKeyContainer.style.width = `100%`;
        this.whiteKeyContainer.style.height = `100%`;

        // this.blackKeyContainer = document.createElement('div');
        // this.blackKeyContainer.setAttribute('id', 'black-keys');
        this.blackKeyContainer.style.position = 'absolute';
        this.blackKeyContainer.style.pointerEvents = 'none';
        this.blackKeyContainer.style.width = `100%`;
        this.blackKeyContainer.style.height = `55%`;

        let keyPattern = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];

        for (let i = this.range[0]; i < this.range[1] + 1; i++) {
            let newKey = document.createElement('div');
            newKey.setAttribute('class', 'key');
            newKey.setAttribute('id', `${i}`);

            newKey.addEventListener('mouseover', (e) => {
                e.preventDefault();
                this.mouseOverKey(e);
            });
            newKey.addEventListener('mouseout', (e) => {
                e.preventDefault();
                this.mouseOutKey(e);
            });
            newKey.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.mouseDownKey(e);
            });
            newKey.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.mouseUpKey(e);
            });

            newKey.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });

            if (keyPattern[i % 12] === 'w') {
                newKey.setAttribute('primaryColor', 'white');
                newKey.style.backgroundColor = 'white';
                this.whiteKeyContainer.appendChild(newKey);
            } else {
                newKey.setAttribute('primaryColor', 'black');
                newKey.style.backgroundColor = 'black';
                newKey.style.pointerEvents = 'all';
                this.blackKeyContainer.appendChild(newKey);
            }

            if (i % 12 === 4 || i % 12 === 11) {
                let ghostKey = document.createElement('div');
                ghostKey.setAttribute('class', 'key ghost-key');
                ghostKey.style.opacity = 0;
                ghostKey.style.pointerEvents = 'none';
                this.blackKeyContainer.appendChild(ghostKey);
            }
        }

        let blackKeyMargin = (this.size[0] / this.whiteKeyContainer.children.length) / 8;

        for (let bk of this.blackKeyContainer.children) {
            bk.style.marginLeft = `${blackKeyMargin}px`
            bk.style.marginRight = `${blackKeyMargin}px`
        };

        this.blackKeyContainer.style.paddingLeft = `${blackKeyMargin * 4}px`;
        this.blackKeyContainer.style.paddingRight = `${blackKeyMargin * 4}px`;

        // let template = `
        //     <style>
        //         #key-container {
        //             width: '${this.size[0]}px';
        //             height: '${this.size[1]}px';
        //             position: relative;
        //         }

        //         #white-keys {
        //             display: flex;
        //             width: 100%;
        //             height: 100%;
        //         }

        //         #black-keys {
        //             position: absolute;
        //             pointer-events: none;
        //             display: flex;
        //             justify-content: space-between;
        //             width: 100%;
        //             height: 55%;
        //         }
        //     </style>
        //     <div id="key-container">
        //         ${this.blackKeyContainer.innerHTML}
        //         ${this.whiteKeyContainer.innerHTML}
        //     </div>
        // `

        this.keyContainer.appendChild(this.blackKeyContainer);
        this.keyContainer.appendChild(this.whiteKeyContainer);
        this.pianoContainer.appendChild(this.keyContainer);
        // this.pianoContainer.innerHTML = template;
    }


    mouseDownKey(e) {
        this.setActive(e.target);
        // this.emit('noteOn', { note: e.target.id });
        this.emitter.noteOn(e);
    }

    mouseUpKey(e) {
        this.setInactive(e.target);
        // this.emit('noteOff', { note: e.target.id });
        this.emitter.noteOff(e);
    }

    mouseOverKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this.setActive(e.target);
            // this.emit('noteOn', { note: e.target.id });
            this.emitter.noteOn(e);
        }
    }

    mouseOutKey(e) {
        if (this.mouseState === MOUSEDOWN) {
            this.setInactive(e.target);
            // this.emit('noteOff', { note: e.target.id });
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