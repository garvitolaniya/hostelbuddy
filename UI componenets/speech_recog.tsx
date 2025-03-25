import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { 
  createSpeechRecognition, 
  isSpeechRecognitionSupported, 
  ISpeechRecognition,
  startSpeechRecognition,
  stopSpeechRecognition,
  SpeechRecognitionLanguage
} from '@/lib/speechRecognition';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpeechRecognitionProps {
  onSpeechResult: (text: string) => void;
  disabled?: boolean;
}

const SpeechRecognitionComponent: React.FC<SpeechRecognitionProps> = ({ 
  onSpeechResult,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState<SpeechRecognitionLanguage>('en-US');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { toast } = useToast();

  // Update recognition instance when language changes
  useEffect(() => {
    // Check if speech recognition is supported
    const supported = isSpeechRecognitionSupported();
    setIsSupported(supported);
    
    if (supported) {
      recognitionRef.current = createSpeechRecognition(language);
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        stopSpeechRecognition(recognitionRef.current);
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      stopSpeechRecognition(recognitionRef.current);
      setIsListening(false);
      
      // If there's an interim transcript, use it as the final result
      if (interimTranscript) {
        onSpeechResult(interimTranscript);
        setInterimTranscript('');
      }
    } else {
      // Start listening
      startSpeechRecognition(
        recognitionRef.current,
        (text) => {
          // Handle interim results
          setInterimTranscript(text);
        },
        (text) => {
          // Handle final result
          setIsListening(false);
          onSpeechResult(text);
          setInterimTranscript('');
        },
        (error) => {
          // Handle errors
          console.error(error);
          setIsListening(false);
          toast({
            title: "Speech Recognition Error",
            description: error,
            variant: "destructive"
          });
        }
      );
      
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground"
        onClick={() => toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in this browser.",
          variant: "destructive"
        })}
        disabled={disabled}
      >
        <MicOff size={18} />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={language} 
        onValueChange={(value) => setLanguage(value as SpeechRecognitionLanguage)}
        disabled={isListening || disabled}
      >
        <SelectTrigger className="w-[90px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-US">English</SelectItem>
          <SelectItem value="hi-IN">हिंदी</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant={isListening ? "default" : "ghost"}
        size="icon"
        className={isListening ? "bg-primary text-primary-foreground animate-pulse-subtle" : "text-muted-foreground"}
        onClick={toggleListening}
        disabled={disabled}
      >
        {isListening ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Mic size={18} />
        )}
      </Button>
      
      {interimTranscript && (
        <div className="absolute bottom-16 left-0 right-0 mx-auto max-w-md p-2 bg-background/80 backdrop-blur-sm border border-border rounded-md text-sm text-foreground animate-fade-in">
          <p className="text-muted-foreground font-light italic">{interimTranscript}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechRecognitionComponent;
