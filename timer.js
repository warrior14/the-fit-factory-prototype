import { speak } from "./speak.js";
let counter = document.getElementById("timer");
let app = document.getElementById("app");
let setTimeInput = document.getElementById("setTimeInput");
let setCoolDownInput = document.getElementById("setCoolDownInput");
export const timer = (sets) => {
    sets--
    let timeout;
    let timeoutHandle;
    let timeoutCoolDownHandle;
    let timeoutCoolDown;
    // This is the resting time function, is in charge of giving the user a break after completing a set
    // the time for this is set by the user in the exercise card.
    const countdownRestTime = (minutesCD, secondsCD, minutesT, seconds) => {
        let coolDownTick = () => {
            counter.innerHTML =
                minutesCD.toString() + ":" + (secondsCD < 10 ? "0" : "") + String(secondsCD);
            secondsCD--;
            // everytime seconds is fulfilled this will trigger until seconds and minutes both reach 0
            if (secondsCD >= 0) {
                timeoutCoolDownHandle = setTimeout(coolDownTick, 1000);
            } else {
                // everytime a minute is fulfilled this is triggered until minutes reaches 0
                if (minutesCD >= 1) {
                    timeoutCoolDown = setTimeout(() => {
                        countdownRestTime(minutesCD - 1, 59, minutesT, seconds);
                    }, 1000);
                } else {
                    // when there are 0 more minutes but seconds left this section is triggered
                    if (minutesCD === 0) {
                        speak("Cool Down Finished", "en-GB")
                        speak("Next Set Start", "en-GB");
                        countdownMinutesAndSeconds(minutesT - 1, 59)
                    } else {
                        timeoutCoolDown = setTimeout(() => {
                            countdownRestTime(minutesCD - 1, 59, minutesT, seconds);
                        }, 1000);
                    }
                }
            }
        }
        coolDownTick();
    }
    // This function is in charge of counting down, it accepts two parameters of minutes and seconds
    const countdownMinutesAndSeconds = (minutes, seconds) => {
        let startingMinutes = setTimeInput.value;
        let minutesAndSecondsTick = () => {
            counter.innerHTML =
                minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
            seconds--;
            // everytime seconds is fulfilled this will trigger until seconds and minutes both reach 0
            if (seconds >= 0) {
                timeoutHandle = setTimeout(minutesAndSecondsTick, 1000);
            } else {
                // everytime a minute is fulfilled this is triggered until minutes reaches 0
                if (minutes >= 1) {
                    timeout = setTimeout(() => {
                        countdownMinutesAndSeconds(minutes - 1, 59);
                    }, 1000);
                } else {
                    // when there are 0 more minutes but seconds left this section is triggered
                    if (sets === 0) {
                        speak("Workout Finished, GREAT JOB!", "en-GB", 0.6)
                    } else {
                        speak("Set Complete", "en-GB", 0.6)
                        minutes = startingMinutes;
                        timeout = setTimeout(() => {
                            speak("Cool down start", "en-GB");
                            countdownRestTime(setCoolDownInput.value, 0, minutes, seconds);
                        }, 1000);
                        sets--
                    }
                }
            }
        }
        minutesAndSecondsTick();
    }
    // UNCOMMENT THIS IF HOURS MINUTES AND SECONDS METHOD IS IN USE
    // this starts the countdown depending if they have hours or just minutes and seconds
    // if (typeof hoursInput === 'undefined' || hoursInput === "0" || hoursInput === "00" ) {
        countdownMinutesAndSeconds(setTimeInput.value,0)
    // } else {
    //     countdownHoursMinutesAndSeconds(1, setTimeInput.value,0);
    // }
    // this function is for when they click stop button
    app.addEventListener("stopRenderingTimer", () => {
        clearTimeout(timeout);
        clearTimeout(timeoutHandle);
        clearTimeout(timeoutCoolDown);
        clearTimeout(timeoutCoolDownHandle);
        counter.innerHTML = "";
        speak("Workout Finished", "en-GB", 0.8);
    });
}
// NOT IN USE AT THE MOMENT
// const countdownHoursMinutesAndSeconds = (hours, minutes, seconds) => {
//     let hoursMinutesAndSecondsTick = () => {
//         counter.innerHTML = hours.toString() + ":" + (minutes < 10 ? "0" : "") + String(minutes) + ":" + (seconds < 10 ? "0" : "") + String(seconds);
//         seconds--;
//         if (seconds >= 0) {
//             timeoutHandle = setTimeout(hoursMinutesAndSecondsTick, 1000);
//         } else {
//             if (minutes >= 1) {
//                 timeout = setTimeout(function () { countdownHoursMinutesAndSeconds(hours, minutes - 1, 59); }, 1000);
//             }
//             else if (hours >= 1) {
//                 timeout = setTimeout(function () { countdownHoursMinutesAndSeconds(hours - 1, 59, 59); }, 1000);
//             }
//
//         }
//     }
//     hoursMinutesAndSecondsTick();
// }