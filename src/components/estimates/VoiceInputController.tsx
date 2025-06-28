import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, StopCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInputControllerProps {
  onTranscriptionComplete: (text: string) => void;
  onProcessing: (isProcessing: boolean) => void;
  className?: string;
}

const VoiceInputController: React.FC<VoiceInputControllerProps> = ({
  onTranscriptionComplete,
  onProcessing,
  className
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [volume, setVolume] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  
  // Check browser support for Web Speech API
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Voice input not supported",
        description: "Your browser does not support voice input. Please use a modern browser like Chrome.",
        variant: "destructive",
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [toast]);

  // Setup audio analyzer for volume visualization
  const setupAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      const updateVolume = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = Math.min(100, Math.max(0, average * 1.5));
        setVolume(normalizedVolume);
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const cleanupAudioAnalyzer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setVolume(0);
  };

  const startListening = async () => {
    try {
      if (!isSupported) return;
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
        setupAudioAnalyzer();
      };
      
      recognitionRef.current.onresult = (event) => {
        let final = '';
        let interim = '';
        
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        setTranscript(final.trim());
        setInterimTranscript(interim);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
        
        toast({
          title: "Speech recognition error",
          description: event.error === 'not-allowed' 
            ? "Microphone access was denied." 
            : "An error occurred. Please try again.",
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          stopListening();
        }
      };
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      
      toast({
        title: "Failed to start voice input",
        description: "Please ensure you have granted microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsListening(false);
    cleanupAudioAnalyzer();
    
    if (transcript.trim()) {
      setIsProcessing(true);
      onProcessing(true);
      
      // Simulate AI processing
      setTimeout(() => {
        onTranscriptionComplete(transcript);
        setIsProcessing(false);
        onProcessing(false);
      }, 1500);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Button
              size="lg"
              className={cn(
                "h-16 w-16 rounded-full",
                isListening && "bg-red-600 hover:bg-red-700 animate-pulse"
              )}
              disabled={!isSupported || isProcessing}
              onClick={isListening ? stopListening : startListening}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isListening ? (
                <StopCircle className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            {isListening && (
              <div className="absolute -inset-3 rounded-full border-4 border-blue-200 animate-ping opacity-20" />
            )}
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium">
              {isProcessing ? (
                "Processing your input..."
              ) : isListening ? (
                "Listening... Speak now"
              ) : (
                "Tap to speak"
              )}
            </div>
            {!isSupported && (
              <div className="text-xs text-red-500 mt-1">
                <MicOff className="h-3 w-3 inline mr-1" />
                Voice input not supported in your browser
              </div>
            )}
          </div>
          
          {isListening && (
            <Progress value={volume} className="w-full h-1" />
          )}
          
          {(transcript || interimTranscript) && (
            <div className="w-full mt-4 p-4 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
              <p className="text-sm">
                {transcript} <span className="text-muted-foreground">{interimTranscript}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInputController;