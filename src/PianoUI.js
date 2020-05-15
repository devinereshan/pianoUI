const EventEmitter = require('events');


const MOUSEUP = 0;
const MOUSEDOWN = 1;

export default class PianoUI extends EventEmitter {
    constructor(target, size, range) {
        super();

        this.target = target;
        this.size = size;

        // [lowNote, highNote] - inclusive
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

    buildUI() {
        this.pianoContainer = document.getElementById(this.target);


        this.keyContainer = document.createElement('div');
        this.keyContainer.style.width = `${this.size[0]}px`;
        this.keyContainer.style.height = `${this.size[1]}px`;
        this.keyContainer.style.position = 'relative';
        this.keyContainer.style.border = '1px solid green';


        this.whiteKeyContainer = document.createElement('div');
        this.whiteKeyContainer.setAttribute('id', 'white-keys');
        this.whiteKeyContainer.style.width = `100%`;
        this.whiteKeyContainer.style.height = `100%`;

        this.blackKeyContainer = document.createElement('div');
        this.blackKeyContainer.setAttribute('id', 'black-keys');
        this.blackKeyContainer.style.pointerEvents = 'none';
        this.blackKeyContainer.style.width = `100%`;
        this.blackKeyContainer.style.height = `55%`;

        let whiteKeyCount = 0;

        let keyPattern = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];
        this.blackKeys = [];
        this.whiteKeys = [];
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

            // prevent keys from being dragged
            newKey.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });

            if (keyPattern[i % 12] === 'w') {
                newKey.setAttribute('primaryColor', 'white');
                newKey.style.backgroundColor = 'white';
                this.whiteKeys.push(newKey);
                this.whiteKeyContainer.appendChild(newKey);
                whiteKeyCount += 1;
            } else {
                newKey.setAttribute('primaryColor', 'black');
                newKey.style.backgroundColor = 'black';
                newKey.style.pointerEvents = 'all';
                this.blackKeys.push(newKey);
            }

            if (i % 12 === 4 || i % 12 === 11) {
                let ghostKey = document.createElement('div');
                ghostKey.setAttribute('class', 'key ghost-key');
                ghostKey.style.opacity = 0;
                ghostKey.style.pointerEvents = 'none';
                this.blackKeys.push(ghostKey);
            }


        }

        let whiteKeyWidth = this.size[0] / whiteKeyCount;
        let blackKeyWidth = whiteKeyWidth / 2;

        this.blackKeys.forEach(bk => {
            bk.style.marginLeft = `${blackKeyWidth / 4}px`
            bk.style.marginRight = `${blackKeyWidth / 4}px`
            this.blackKeyContainer.appendChild(bk);
        });
        this.blackKeyContainer.style.paddingLeft = `${whiteKeyWidth / 2}px`;
        this.blackKeyContainer.style.paddingRight = `${whiteKeyWidth / 2}px`;


        this.keyContainer.appendChild(this.blackKeyContainer);
        this.blackKeyContainer.style.position = 'absolute';
        this.keyContainer.appendChild(this.whiteKeyContainer);
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
        if (this.mouseState === MOUSEDOWN) {
            this.setInactive(e.target);
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
            pianoKey.style.backgroundColor = pianoKey.getAttribute('primaryColor');
        }
    }

}