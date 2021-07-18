import { timer } from './timer.js'
import { speak } from "./speak.js";
let app = document.getElementById("app");
let startWorkoutButton = document.getElementById("playButton");
let stopWorkoutButton = document.getElementById("stopButton");
let setsInput = document.getElementById("setsInput");
// This attaches an event listener to the start workout button
startWorkoutButton.addEventListener(("click"), () => {
    app.dispatchEvent(new CustomEvent("renderTimer"));
});

// this attaches an event listener to the stop workout button
stopWorkoutButton.addEventListener(("click"),() => {
    // it dispatches a new custom event called stop rendering timer which triggers an event listener in timer.js
    app.dispatchEvent(new CustomEvent("stopRenderingTimer"));
});

// this attaches the render timer event listener which is dispatched in the first event listener at the top
app.addEventListener(("renderTimer"), () => {
    // this condition is to make sure that users dont put 0 sets if they do, then it will tell the user they need more than 0 sets and it will not
    // execute the timer function.
    if (setsInput.value !== "0") {
        // what this event listener does it calls the speak function in speak.js and passes a phrase, a language, and a speed as parameters.
        speak("Start the first Set", "en-GB", 0.8);
        // after that it calls the timer function and passes the value of the setsInput element ("the amount of sets the user put in the input")
        timer(setsInput.value);
    } else {
        speak("You must have more than 0 sets", "en-GB", 0.8);
    }
});
