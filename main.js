import { timer } from './timer.js'
import { speak } from "./speak.js";
let app = document.getElementById("app");
let startWorkoutButton = document.getElementById("playButton");
let stopWorkoutButton = document.getElementById("stopButton");
let setsInput = document.getElementById("setsInput");
startWorkoutButton.addEventListener(("click"), () => {
    app.dispatchEvent(new CustomEvent("renderTimer"));
});
stopWorkoutButton.addEventListener(("click"),() => {
    app.dispatchEvent(new CustomEvent("stopRenderingTimer"));
});
app.addEventListener(("renderTimer"), () => {
    speak("Start the first Set", "en-GB", 0.8);
    timer(setsInput.value);
})