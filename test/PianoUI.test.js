import { assert } from 'chai';
import { Piano } from '../src/PianoUI';


describe('PianoUI.js - Piano.constructor()', function() {
    it("Failing to pass a valid 'target' parameter to constructor throws an error", function() {
        assert.throw(() => {new Piano()}, Error, "Invalid 'target' parameter in Piano constructor. Could not find element matching 'undefined'");
    });

    // Test all uiDefaults when no options are passed to constructor
    let pianoContainer = document.createElement('div');
    pianoContainer.id = 'piano-container';
    document.body.appendChild(pianoContainer);
    let piano = new Piano('#piano-container');

    it("Piano options initialize to defaults when not passed as parameter to constructor", function() {
        let uiDefaults = {
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
        assert.deepEqual(uiDefaults, piano.options);
        pianoContainer.innerHTML
    });

    it("Piano actual width matches default size", function() {
        assert.equal(piano.keyContainer.offsetWidth, 800);
    });

    it("Piano actual height matches default size", function() {
        assert.equal(piano.keyContainer.offsetHeight, 200);
    });
});


// - all uiDefault values match the actual rendered values of Piano Element (color, borderwidth, etc...)
// - passing partial options replaces the uiDefaults equivalent in final object but still utilizes uiDefaults for options not specified
// - passing options does not mutate uiDefaults in any way so that future piano objects have access to the original defaults
// - invalid options are not processed or stored in anyway and do not impact object instantiation.
// - media queries are properly registered


// Media queries
// original media query object is copied and not mutated
// invalid queries throw error
// queries are properly registered with 'this' bound to piano object

// test all getters and setters
// invalid values make no changes to ui but log a warning

// When amount of piano keys changes through set range, old key objects are properly removed from DOM and memory is freed

// TODO: update piano key custom attribute names. prepend with pianoui- or pui- or pianokey- or something...

