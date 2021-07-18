// this function is in charge of manking new instances of utterance, this means is in charge of making the browser speak.
// it takes 4 parameters, phrase, language, speechSpeed and volume.
export const speak = (phrase, language, speechSpeed = 0.8, volume = "") => {
    // first it needs to make a new "Speech Syntesis Utterance" by using the class SpeechSynthesisUtterance() and passing the phrase into it
    // we assign it to the speech variable.
    let speech = new SpeechSynthesisUtterance(phrase);
    // after creating a new speechSynthesisUtterance we can assign it things such as language or speed, pitch or volume.
    speech.lang = language;
    speech.rate = speechSpeed;
    console.log('its speaking', speech);
    // since web speech api is already included with most browsers you only neeed to call the speechSynteshis class within the window and use its
    // speak function, and so you pass your speech into it.
    window.speechSynthesis.speak(speech);
}