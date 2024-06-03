import React, { useEffect, useState } from 'react';

const App = () => {
  const synth = window.speechSynthesis;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Your browser does not support SpeechRecognition');
      return;
    }

    // Create a new instance of SpeechRecognition
    const recognizer = new SpeechRecognition();
    recognizer.continuous = true; // Keep recognizing even when the user pauses
    recognizer.interimResults = true; // Show interim results (results while the user is speaking)
    recognizer.lang = 'en-US'; // Set the language

    // Event handler for when the recognition service returns a result
    recognizer.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment + ' ';
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    // Event handler for when the recognition service ends
    recognizer.onend = () => {
      setIsListening(false);
    };

    // Set the recognizer instance
    setRecognition(recognizer);

    return () => {
      recognizer.stop();
    };
  }, []);

  // Function to start/stop recognition
  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const readVoice = () => {    
      const voices = synth.getVoices();
      console.log(voices);
      const selectedVoice = voices.find(voice => voice.name === 'Google UK English Male') || voices[0];
      const utterance = new SpeechSynthesisUtterance('Hello, world!');

      utterance.voice = selectedVoice;
      utterance.rate = 1; // Set speech rate
      utterance.pitch = 1; // Set pitch

      synth.speak(utterance);

      utterance.onend = () => {
        console.log('Speech synthesis finished.');
      };
  }

  return <div>Speech Synthesizer Component <button onClick={readVoice}>Voice</button>
   <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div>
        <h2>Transcript:</h2>
        <p>{transcript}</p>
      </div></div>;
};

export default App;
