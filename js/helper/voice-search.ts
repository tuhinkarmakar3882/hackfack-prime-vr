import {qs} from "./common";
import {UIElements} from "../constants";

export function voiceSearch() {
  // @ts-ignore
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  // @ts-ignore
  // const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  // @ts-ignore
  // const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  // testBtn.disabled = true;
  // testBtn.textContent = 'Test in progress';
  // diagnosticPara.textContent = '...diagnostic messages';
  // const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';

  const recognition = new SpeechRecognition();
  // const speechRecognitionList = new SpeechGrammarList();
  // speechRecognitionList.addFromString(grammar, 1);
  // recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  qs(UIElements.theatreScreen).volume = 0.1

  recognition.onresult = function (event) {
    /**
     * @type{string} speechResult
     */
    const speechResult = event.results[0][0].transcript.toLowerCase();
    console.log('Speech received: ' + speechResult + '.'
    )


    // @ts-ignore
    window.axios.post('http://localhost:5000/yt/', {
      searchString: speechResult
    }).then(({data}) => {
      qs(UIElements.theatreScreen).volume = 0.1

      const utterance = new SpeechSynthesisUtterance(`Playing ${speechResult}`);
      speechSynthesis.speak(utterance);

      setTimeout(() => {
        qs(UIElements.theatreScreen).src = new URL(`http://localhost:5000/${data}`).toString()
        qs(UIElements.theatreScreen).volume = 1
        qs(UIElements.theatreScreen).play()
      }, 2000)
    }).catch(console.warn)
  }

  recognition.onspeechend = function () {
    recognition.stop();
    qs(UIElements.theatreScreen).volume = 1
  }

  recognition.onerror = function (event) {
    console.error('Error occurred in recognition: ' + event.error)
  }

  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    qs(UIElements.theatreScreen).volume = 0.1
    console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    qs(UIElements.theatreScreen).volume = 1
    console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
    qs(UIElements.theatreScreen).volume = 1
  }

  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
    qs(UIElements.theatreScreen).volume = 0.1
  }
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
  }
}
