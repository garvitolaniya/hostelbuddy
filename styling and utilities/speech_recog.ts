// Speech recognition utility

// Check if browser supports the Web Speech API
export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Define Speech Recognition interface for TypeScript
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message: string;
};

// Language options
export type SpeechRecognitionLanguage = 'en-US' | 'hi-IN';

// Speech recognition interface
export interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

// Create and configure speech recognition instance
export const createSpeechRecognition = (language: SpeechRecognitionLanguage = 'en-US'): ISpeechRecognition | null => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  // Use the appropriate constructor based on browser support
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition() as ISpeechRecognition;

  // Configure the recognition
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = language; // Set language based on parameter

  return recognition;
};

// Helper function to start recording with proper error handling
export const startSpeechRecognition = (
  recognition: ISpeechRecognition | null, 
  onInterimResult: (text: string) => void,
  onFinalResult: (text: string) => void,
  onError: (error: string) => void
) => {
  if (!recognition) {
    onError('Speech recognition is not supported in this browser');
    return;
  }

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    
    if (event.results[0].isFinal) {
      onFinalResult(transcript);
    } else {
      onInterimResult(transcript);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(`Error occurred in recognition: ${event.error}`);
  };

  recognition.onend = () => {
    // Could implement auto-restart here if continuous mode is desired
  };

  try {
    recognition.start();
  } catch (error) {
    onError(`Could not start speech recognition: ${error}`);
  }
};

// Stop ongoing speech recognition
export const stopSpeechRecognition = (recognition: ISpeechRecognition | null) => {
  if (recognition) {
    recognition.stop();
  }
};
