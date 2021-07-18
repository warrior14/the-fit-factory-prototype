import { speak } from "./speak.js";
let counter = document.getElementById("timer");
let app = document.getElementById("app");
let setTimeInput = document.getElementById("setTimeInput");
let setCoolDownInput = document.getElementById("setCoolDownInput");

// This function is pretty chunky as it has the capability to do multiple things
// it has 2 functions that are pretty much the same, but one of them is used for the cooldown (rest time) and the other is used for the sets
// this function takes a parameter of number of sets
export const timer = (sets) => {
    console.log('sets', sets);
    // the first thing we want to do is lower the number of sets by 1, because by default this functions will run 1 time the first time.
    // this function runs once regardless of anything you do, so if the user passes 2 sets, it will truly run 3 times, because it runs a first time
    // and theres nothing you can do about it so we must decrease the number of sets the user passes so that it ends up running as many times as the
    // user wants.
    sets--
    let timeout;
    let timeoutHandle;
    let timeoutCoolDownHandle;
    let timeoutCoolDown;
    // This is the resting time function, is in charge of giving the user a break after completing a set
    // the time for this is set by the user in the exercise card.
    // the way these 2 functions work is a bit complicated, basically the logic has different conditions that if met they will keep calling eachother
    // im talking about eh countdownRestTime() method and the coolDownTick() method
    const countdownRestTime = (minutesCD, secondsCD, minutesT, seconds) => {
        // so inside the countdownRestTime() method we have the creation of the coolDownTick() method that then gets called at the end of this function
        let coolDownTick = () => {
            // inside the coolDownTick() method the first thing we have is that its going to inster the minutes and seconds into the innerHTML of the
            // counter element we defined above at the very top of timer.js
            counter.innerHTML =  `${minutesCD}:${(secondsCD < 10 ? "0" : "")}${secondsCD}`;
                // the second thing it does is it subtracts the seconds by 1 each time this function is ran.
            secondsCD--;
            // the first condition says so long as seconds is greater or equal to 0 you will run yourself 
            // everytime this condition is met the coolDownTick() method will be ran which means seconds will always dicrease by 1 until
            // the condition is no longer met which is when seconds would be 0
            if (secondsCD >= 0) {
                // setTimeout() is a method that says you will wait 1 milisecond before executing the function passed to it, in this case coolDownTick(),
                // at which moment this function is ran again from the beginning and decreasing another second so on and so forth.
                timeoutCoolDownHandle = setTimeout(coolDownTick, 1000);
            } else {
                // when the seconds reach 0 that means the first condition is no longer met so it jumps into this else block.
                // this condition says so long as minutes is greater or equal to 1 then call the whole function again not just the coolDownTick()
                // but rather the whole countDownRestTime(), this is important because it ensures that as it is ran from the top that it gets
                // caught in the seconds condition again.
                if (minutesCD >= 1) {
                    // so like I said when the code enters this block we are telling it execute the whole function again but notice that its
                    // subtracting 1 form minutes and setting the seconds back to 59, this means that when it runs again the first seconds condition
                    // will be met and it will subtract seconds again till they reach 0.
                    // This block of code is to handle things when the cooldown time is more than a minute long.
                    timeoutCoolDown = setTimeout(() => {
                        // the minutesT and seconds parameters are just there so that we can send those back to the function below. explanation will be
                        // down in the countdownMinutesAndSeconds() function.
                        countdownRestTime(minutesCD - 1, 59, minutesT, seconds);
                    }, 1000);
                } else {
                    // so, at last when seconds have reached 0 and minutes have reached 0 then execute this section of code
                    // the first condition says, if minutes are indeed 0 and because you are here means that seconds are also 0 then execute the
                    // code in the "if"
                    if (minutesCD === 0) {
                        // we tell the browser to say these things in british english
                        speak("Cool Down Finished", "en-GB")
                        speak("Next Set Start", "en-GB");
                        // amd then we tell it to invoke the countdownMinutesAndSeconds() so that now it can start the countdown for the next set
                        // we pass the parameter of minutesT which is the minutes that are left from the set but we subtract 1 to let the
                        // countdownMinutesAndSeconds() function that we have finished one set, and we pass 59 seconds.
                        countdownMinutesAndSeconds(minutesT - 1, 59)
                    } else {
                        // however, if there are no more minutes, so if minutes is 0, theoretically we still have to count down from 59 seconds to 0
                        // so we are telling the app, hey, even though you dont have anymore minutes, you still have to count from 59 to 0 which is the
                        // final minute. 
                        // So this block of code will execute when the timer reaches 1:00 from 1:01 and is ready to be 00:59 so minutes are not yet 0 they are 1
                        // but by invoking countdownRestTime() again and subtracting 1 from minutes then as it runs again and it countdowns from 59 seconds to 0 the
                        // minutes now will be 0 and it will instead go to the "if" block above and thus ending the cooldown phase.
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
            // the thing to notice here is that theres a ternary, basically im rendering seconds twice and displaying them side by side
            // however the ternary says, only display the second set once its below 10 but at that point its always going to be 0
            // this way its displayed as 01 instead of 1.
            counter.innerHTML = `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
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
                        // once sets have reached 0 the whole workout is finished and it doesnt run a cooldown phase because its just done.
                        speak("Workout Finished, GREAT JOB!", "en-GB", 0.6)
                    } else {
                        speak("Set Complete", "en-GB", 0.6)
                        minutes = startingMinutes;
                        timeout = setTimeout(() => {
                            speak("Cool down start", "en-GB");
                            // we pass the number of minutes the user wants for the cooldown, seconds are not supported yet so we set them to 0 for now
                            // additionally we pass the minutes we have left and the seconds although seconds dont matter right now since we are setting them to 59
                            // once a set is finished anyway, minutes however have to be passed so that we dont loose track of them and we can continute from where we left
                            // off once the cooldown phase is finished.
                            countdownRestTime(setCoolDownInput.value, 0, minutes, seconds);
                        }, 1000);
                        // after completing a set, and completing a cooldown phase, so long as the minutes are more or equal to 1 the sets will be subtracted
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
        // this is the function that runs when the timer() function is invoked in main.js
        countdownMinutesAndSeconds(setTimeInput.value, 0)
    // } else {
    //     countdownHoursMinutesAndSeconds(1, setTimeInput.value,0);
    // }


    // this function is for when they click stop button
    app.addEventListener("stopRenderingTimer", () => {
        // clicking the stop button means Im done, no more so it clears out all of the timeouts
        // which stops all of the countdowns and thus ends the workout phase.
        clearTimeout(timeout);
        clearTimeout(timeoutHandle);
        clearTimeout(timeoutCoolDown);
        clearTimeout(timeoutCoolDownHandle);
        // as the workout phase is done the timer is replaced by an empty string which means the timer disappears.
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