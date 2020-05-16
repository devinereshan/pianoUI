import Piano from './Piano';
import styles from './PianoUI.module.css';

let piano = new Piano('piano-container', [960, 240], [36, 60]);

let test = document.createElement('template');

// console.log(styles);
// console.log(styles.test);
let testString = `
    <div class=${styles.test}>Test</div>
`

testString = testString.trim();

test.innerHTML = testString;

document.body.appendChild(test.content.firstChild);




