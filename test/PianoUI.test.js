import { assert } from 'chai';
import { Piano } from '../src/PianoUI';

function createPianoContainer(id) {
    let pianoContainer = document.createElement('div');
    pianoContainer.id = id;
    document.body.appendChild(pianoContainer);
    return pianoContainer;
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
    whiteKeyBorderWidth: '1px',
    blackKeyBorderWidth: '1px',
    blackKeyWidthRatio: 0.75,
    blackKeyHeight: '55%',
    mouseVelocity: 127,
}

describe('PianoUI.js - Piano constructor', function() {
    it("Failing to pass a valid 'target' parameter to constructor throws an error", function() {
        assert.throw(() => {new Piano()}, Error, "Invalid 'target' parameter in Piano constructor. Could not find element matching 'undefined'");
    });

    it("Piano options initialize to defaults when not passed as parameter to constructor", function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        assert.deepEqual(piano.options, uiDefaults);
        document.body.removeChild(pianoContainer);
    });

    it("Piano actual width matches default size", function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        assert.equal(piano.keyContainer.offsetWidth, 800);
        document.body.removeChild(pianoContainer);
    });

    it("Piano actual height matches default size", function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        assert.equal(piano.keyContainer.offsetHeight, 200);
        document.body.removeChild(pianoContainer);
    });

    it("Piano key border width matches default", function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        let actual = getComputedStyle(piano.keys[0]).getPropertyValue('border-bottom-width');
        assert.equal(actual, '1px');
        document.body.removeChild(pianoContainer);
    });
});



describe('PianoUI.js - Piano constructor options', function() {
    it("Passing a single option integrates with uiDefaults", function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {size:  ['500px', '125px']});

        let expected = {
            size:  ['500px', '125px'],
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

        assert.deepEqual(piano.options, expected);
        document.body.removeChild(pianoContainer);
    });

    it("Passing options parameter does not mutate uiDefaults for future instances", function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {
            size:  ['500px', '125px'],
            range: [48, 60],
            colors: {
                whiteKey: 'yellow',
                blackKey: 'blue',
                whiteKeyHighlight: 'orange',
                blackKeyHighlight: 'orange',
                blackKeyBorder: 'pink',
                whiteKeyBorder: 'pink',
            },
            whiteKeyBorderWidth: '2px',
            blackKeyBorderWidth: '3px',
            blackKeyWidthRatio: 0.5,
            blackKeyHeight: '40%',
            mouseVelocity: 100,
        });

        let pianoTwoContainer = createPianoContainer('piano-two-container');
        let pianoTwo = new Piano('#piano-two-container');

        assert.deepEqual(pianoTwo.options, uiDefaults);
        document.body.removeChild(pianoContainer);
        document.body.removeChild(pianoTwoContainer);
    });

    it("Invalid option keys passed to constructor are not stored in final options object", function() {
        let pianoContainer = createPianoContainer('piano-container');

        let piano = new Piano('#piano-container', {balogna: 3});

        assert.deepEqual(piano.options, uiDefaults);
        document.body.removeChild(pianoContainer);
    });

    it("Invalid color keys passed to constructor are not stored in final options object", function() {
        let pianoContainer = createPianoContainer('piano-container');

        let piano = new Piano('#piano-container', {
            colors: {balogna: 3}
        });

        assert.deepEqual(piano.options, uiDefaults);
        document.body.removeChild(pianoContainer);
    });
});



describe('PianoUI.js - range tests', function() {
    // Ensure spacing of black keys is properly handled for various start and end values of range
    it('Black keys are properly sized and spaced for range C - C', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {
            size: ['800px', '200px'],
            range: [0, 12]
        });

        let blackKey = piano.blackKeyContainer.firstChild
        let blackKeyWidth = blackKey.offsetWidth;
        let blackKeyMargin = window.getComputedStyle(blackKey).getPropertyValue('margin-left');

        let blackKeyContainerPadding = window.getComputedStyle(piano.blackKeyContainer).getPropertyValue('padding-left');
        let numKeys = piano.blackKeyContainer.children.length;

        assert.equal(blackKeyWidth, 75);
        assert.equal(blackKeyMargin, '12.5px');
        assert.equal(blackKeyContainerPadding, '50px');
        assert.equal(numKeys, 7);

        document.body.removeChild(pianoContainer);
    });

    it('Black keys are properly sized and spaced for range C - E', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {
            size: ['300px', '200px'],
            range: [0, 4]
        });

        let blackKey = piano.blackKeyContainer.firstChild
        let blackKeyWidth = blackKey.offsetWidth;
        let blackKeyMargin = window.getComputedStyle(blackKey).getPropertyValue('margin-left');

        let blackKeyContainerPadding = window.getComputedStyle(piano.blackKeyContainer).getPropertyValue('padding-left');
        let numKeys = piano.blackKeyContainer.children.length;

        assert.equal(blackKeyWidth, 75);
        assert.equal(blackKeyMargin, '12.5px');
        assert.equal(blackKeyContainerPadding, '50px');
        assert.equal(numKeys, 2);

        document.body.removeChild(pianoContainer);
    });

    it('Black keys are properly sized and spaced for range E - B', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {
            size: ['500px', '200px'],
            range: [4, 11]
        });

        let blackKey = piano.blackKeyContainer.firstChild
        let blackKeyWidth = blackKey.offsetWidth;
        let blackKeyMargin = window.getComputedStyle(blackKey).getPropertyValue('margin-left');

        let blackKeyContainerPadding = window.getComputedStyle(piano.blackKeyContainer).getPropertyValue('padding-left');
        let numKeys = piano.blackKeyContainer.children.length;

        assert.equal(blackKeyWidth, 75);
        assert.equal(blackKeyMargin, '12.5px');
        assert.equal(blackKeyContainerPadding, '50px');
        assert.equal(numKeys, 4);

        document.body.removeChild(pianoContainer);
    });

    it('Black keys are properly sized and spaced for range B - F', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {
            size: ['500px', '200px'],
            range: [11, 17]
        });

        let blackKey = piano.blackKeyContainer.firstChild
        let blackKeyWidth = blackKey.offsetWidth;
        let blackKeyMargin = window.getComputedStyle(blackKey).getPropertyValue('margin-left');

        let blackKeyContainerPadding = window.getComputedStyle(piano.blackKeyContainer).getPropertyValue('padding-left');
        let numKeys = piano.blackKeyContainer.children.length;

        assert.equal(blackKeyWidth, 75);
        assert.equal(blackKeyMargin, '12.5px');
        assert.equal(blackKeyContainerPadding, '50px');
        assert.equal(numKeys, 4);

        document.body.removeChild(pianoContainer);
    });

    it('Black keys are properly sized and spaced for range E - C', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container', {
            size: ['600px', '200px'],
            range: [4, 12]
        });

        let blackKey = piano.blackKeyContainer.firstChild
        let blackKeyWidth = blackKey.offsetWidth;
        let blackKeyMargin = window.getComputedStyle(blackKey).getPropertyValue('margin-left');

        let blackKeyContainerPadding = window.getComputedStyle(piano.blackKeyContainer).getPropertyValue('padding-left');
        let numKeys = piano.blackKeyContainer.children.length;

        assert.equal(blackKeyWidth, 75);
        assert.equal(blackKeyMargin, '12.5px');
        assert.equal(blackKeyContainerPadding, '50px');
        assert.equal(numKeys, 5);

        document.body.removeChild(pianoContainer);
    });
});


describe('PianoUI.js - getters and setters', function() {

    it('Should get the specified color', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        let actual = piano.getColor('whiteKey');
        assert.equal(actual, 'white');

        document.body.removeChild(pianoContainer);
    });

    it('Should set a single color', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        piano.setColors({'whiteKey': 'blue'});

        let expected = {
            whiteKey: 'blue',
            blackKey: 'black',
            whiteKeyHighlight: 'aqua',
            blackKeyHighlight: 'aqua',
            blackKeyBorder: 'gray',
            whiteKeyBorder: 'gray',
        }

        assert.deepEqual(piano.options.colors, expected);

        document.body.removeChild(pianoContainer);
    });

    it('Should set multiple colors', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        piano.setColors({
            whiteKey: 'blue',
            blackKey: 'green',
            whiteKeyHighlight: 'pink',
            blackKeyHighlight: 'pink',
            blackKeyBorder: 'white',
            whiteKeyBorder: 'orange',
        });

        let expected = {
            whiteKey: 'blue',
            blackKey: 'green',
            whiteKeyHighlight: 'pink',
            blackKeyHighlight: 'pink',
            blackKeyBorder: 'white',
            whiteKeyBorder: 'orange',
        }

        assert.deepEqual(piano.options.colors, expected);

        document.body.removeChild(pianoContainer);
    });

    it('Should not set invalid color option', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        piano.setColors({
            bologna: 'blue',
        });

        let expected = {
            whiteKey: 'white',
            blackKey: 'black',
            whiteKeyHighlight: 'aqua',
            blackKeyHighlight: 'aqua',
            blackKeyBorder: 'gray',
            whiteKeyBorder: 'gray',
        }

        assert.deepEqual(piano.options.colors, expected);

        document.body.removeChild(pianoContainer);
    });

    it('Size setter should update the width of the keyboard', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        piano.setSize(['600px', '150px']);

        let expected = [600, 150];
        let actual = [];
        actual.push(piano.keyContainer.offsetWidth);
        actual.push(piano.keyContainer.offsetHeight);

        assert.deepEqual(actual, expected);

        document.body.removeChild(pianoContainer);
    });

    it('Size getter should match actual keyboard size', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        let expected = piano.getSize();
        let actual = [];
        actual.push(piano.keyContainer.offsetWidth + "px");
        actual.push(piano.keyContainer.offsetHeight + "px");

        assert.deepEqual(actual, expected);

        document.body.removeChild(pianoContainer);
    });

    it('Range getter should match actual keyboard range', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        let expected = piano.getRange();
        let actual = [];
        actual.push(Number(piano.keys[0].getAttribute('pui-keyID')));
        actual.push(Number(piano.keys[piano.keys.length - 1].getAttribute('pui-keyID')));

        assert.deepEqual(actual, expected);

        document.body.removeChild(pianoContainer);
    });



    it('Range setter should update range of keyboard', function() {
        let pianoContainer = createPianoContainer('piano-container');
        let piano = new Piano('#piano-container');

        piano.setRange([0, 48]);

        let actual = piano.getRange();
        let expected = [0, 48];

        console.log()
        assert.deepEqual(actual, expected);

        document.body.removeChild(pianoContainer);
    });


});


// When amount of piano keys changes through set range, old key objects are properly removed from DOM and memory is freed

