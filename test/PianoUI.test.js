import { assert } from 'chai';
import { Piano } from '../src/PianoUI';


describe('PianoUI.js - Piano.constructor()', function() {
    it ("Failing to pass a valid 'target' parameter to constructor throws an error", function() {
        assert.throw(() => {new Piano()}, Error, "Invalid 'target' parameter in Piano constructor. Could not find element matching 'undefined'");
    })
})
// - all uiDefaults are properly initialized if no options are passed as second parameter
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

