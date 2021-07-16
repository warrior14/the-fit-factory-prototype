export const speak = (phrase, language, speechSpeed = 0.8, volume = "") => {
    let speech = new SpeechSynthesisUtterance(phrase);
    speech.lang = language;
    speech.rate = speechSpeed;
    console.log('its speaking', speech);
    // window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}