import { useState, useEffect, useRef } from 'react';

// Fix: Add type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    isFinal: boolean;
    [key: number]: { transcript: string };
  }[];
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Polyfill for cross-browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechToText = (onTranscriptChange: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // This ref will hold the latest `isListening` value, preventing stale closures in `onend`.
  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;
  
  // This ref holds the latest `onTranscriptChange` callback to prevent stale closures.
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  onTranscriptChangeRef.current = onTranscriptChange;

  // This effect runs only once to set up the singleton recognition instance and its event handlers.
  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscriptChangeRef.current(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setError('Microphone permission denied. Please enable it in your browser settings.');
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setError(`Speech recognition error: ${event.error}`);
        }
        // An error should always stop the listening process.
        setIsListening(false);
    };

    recognition.onend = () => {
      // This handler is called when recognition ends for any reason.
      // We check our ref to see if the user *still intends* to be listening.
      // If so, it was likely a browser timeout, and we should restart.
      if (isListeningRef.current) {
         recognition.start();
      }
    };
    
    recognitionRef.current = recognition;

    // Cleanup: when the component unmounts, stop recognition.
    return () => {
      isListeningRef.current = false; // Prevent onend from restarting during unmount.
      recognition.stop();
    };
  }, []); // Empty dependency array means this runs only once.
  
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      // User wants to stop listening. Update state, which updates the ref.
      // `recognition.stop()` will trigger `onend`, but the ref will be `false`, preventing a restart.
      setIsListening(false);
      recognitionRef.current.stop();
    } else {
      // User wants to start listening.
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setError(null);
          setIsListening(true); // Update state, which updates the ref.
          recognitionRef.current?.start();
        })
        .catch((err) => {
          setError('Microphone access was not granted.');
          console.error(err);
        });
    }
  };

  return { isListening, error, toggleListening };
};