import Piano from './Piano';

let piano1 = new Piano('piano-container', {
    size: ['90vw', '20vh'],
    range: [36, 60],
});

// Percentage values are calculated based on dimensions of containing element.
// In this case, the div with id="piano-container" is the reference for calculating
// percentages. Thus, those dimensions must be set explicitly somewhere so that the
// percentage values can be calculated correctly.
let piano3 = new Piano('piano-percentage-container', {
    size: ['70%', '50%'],
    range: [36, 48],
});

let piano2 = new Piano('piano-two-container', {
    size: ['500px', '125px'],
    range: [36, 48],
    colors: {
        whiteKey: '#333',
        blackKey: 'aqua',
        whiteKeyHighlight: 'deeppink',
        blackKeyHighlight: 'deeppink',
    },
    blackKeyWidthRatio: 0.9,
    borderWidth: '3px',
    mouseVelocity: 80,
});

piano2.pianoUI.setMouseVelocity(60);
console.log(piano2.pianoUI.getMouseVelocity());

console.log(piano2.pianoUI.getColor('whiteKeyBorder'));

console.log(piano2.pianoUI.getBlackKeyWidthRatio());
piano2.pianoUI.setBlackKeyWidthRatio(1);
console.log(piano2.pianoUI.getBlackKeyWidthRatio());

let piano4 = new Piano('piano-four-container', {
        size: ['500px', '125px'],
        range: [36, 48],
    },
    {
    '(min-width: 800px)' : function(e) {
        if (e.matches) {
            this.setSizeAndRange(['800px', '200px'], [36, 60]);
            this.setColors({whiteKey: 'white'})
        } else {
            this.setSizeAndRange(['500px', '125px'], [36, 48]);
            this.setColors({whiteKey: 'blue'});
        }
    },
    '(min-width: 1000px)' : function(e) {
        if (e.matches) {
            this.setSizeAndRange(['1000px', '250px'], [36, 60]);
            this.setColors({whiteKey: 'yellow'})
        } else {
            if (window.innerWidth >= 800) {
                this.setSizeAndRange(['800px', '200px'], [36, 60]);
                this.setColors({whiteKey: 'white'})
            }
        }
    },
});

piano4.pianoUI.setMediaQueries({
    '(max-width: 600px)': function(e) {
        if (e.matches) {
            this.setBlackKeyWidthRatio(1);
        } else {
            this.setBlackKeyWidthRatio(0.75);
        }
    }
})

// piano4.pianoUI.setSize(['800px', '200px']);
// piano4.pianoUI.setRange([24, 48]);
// piano4.pianoUI.setSizeAndRange(['50vw', '20vh'], [36, 48]);

let togggleKeyButton = document.getElementById('toggle-key');
togggleKeyButton.addEventListener('mousedown', () => {
    piano4.pianoUI.setKeyActive(42, 20);
});

togggleKeyButton.addEventListener('mouseup', () => {
    piano4.pianoUI.setKeyInactive(42);
});

piano2.setColors({
    blackKeyBorder: 'yellow',
    whiteKey: '#00dd80',
    blackKey: '#cc00cc88'

});