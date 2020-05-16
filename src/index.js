import Piano from './Piano';
import styles from './PianoUI.module.css';

let piano = new Piano('piano-container', [960, 240], [36, 60]);

let piano2 = new Piano('piano-two-container', [500, 125], [36, 48], {
    whiteKey: '#333',
    blackKey: 'aqua',
    whiteKeyHighlight: 'deeppink',
    blackKeyHighlight: 'deeppink',
});


piano2.setColors({whiteKey: 'blue'});