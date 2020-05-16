import Piano from './Piano';

let piano1 = new Piano('piano-container', ['90vw', '20vh'], [36, 60]);

// Percentage values are calculated based on dimensions of containing element.
// In this case, the div with id="piano-container" is the reference for calculating
// percentages. Thus, those dimensions must be set explicitly somewhere so that the
// percentage values can be calculated correctly.
let piano3 = new Piano('piano-percentage-container', ['70%', '50%'], [36, 48]);

let piano2 = new Piano('piano-two-container', ['500px', '125px'], [36, 48], {
    whiteKey: '#333',
    blackKey: 'aqua',
    whiteKeyHighlight: 'deeppink',
    blackKeyHighlight: 'deeppink',
});

let piano4 = new Piano('piano-four-container', ['500px', '125px'], [36, 48], {}, {
    '(max-width: 600px)' : function(e) {
        if (e.matches) {
            this.setColors({whiteKey: 'blue'});
        } else {
            this.setColors({whiteKey: 'white'});
        }
    },
});


piano2.setColors({whiteKey: 'blue'});