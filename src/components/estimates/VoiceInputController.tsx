import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, StopCircle, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check for Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
    }

    // Check for HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setIsSupported(false);
      setError("Speech recognition requires HTTPS or localhost.");
    }
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    setVolume(0);
  };

  const setupAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      const updateVolume = () => {
        if (!analyserRef.current || !isListening) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = Math.min(100, Math.max(0, average * 2));
        setVolume(normalizedVolume);
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  };

  const startListening = async () => {
    try {
      if (!isSupported) return;
      
      setError(null);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError("Speech recognition not available");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
        setupAudioAnalyzer();
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let final = '';
        let interim = '';
        
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        
        setTranscript(final.trim());
        setInterimTranscript(interim);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = '';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access was denied. Please allow microphone access.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setError(errorMessage);
        stopListening();
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        // Always clean up when recognition ends
        setIsListening(false);
        cleanup();
        
        // Process transcript if we have one
        if (transcript.trim()) {
          setIsProcessing(true);
          onProcessing(true);
          
          setTimeout(() => {
            onTranscriptionComplete(transcript);
            setIsProcessing(false);
            onProcessing(false);
            setTranscript('');
            setInterimTranscript('');
          }, 1000);
        }
      };
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError("Failed to start voice input. Please try again.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsListening(false);
    cleanup();
    
    // Don't process transcript here since onend will handle it
    // This prevents double processing
  };

  return (
    <div className={`max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <button
            className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-medium transition-all duration-200 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md'
            } ${!isSupported || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
          </button>
          
          {isListening && (
            <div className="absolute -inset-3 rounded-full border-4 border-blue-200 animate-ping opacity-20" />
          )}
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700">
            {isProcessing ? (
              "Processing your input..."
            ) : isListening ? (
              "Listening... Speak now"
            ) : (
              "Tap to speak"
            )}
          </div>
          
          {error && (
            <div className="text-xs text-red-500 mt-2 max-w-xs">
              <MicOff className="h-3 w-3 inline mr-1" />
              {error}
            </div>
          )}
        </div>
        
        {isListening && (
          <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-blue-500 h-1 transition-all duration-100 ease-out"
              style={{ width: `${volume}%` }}
            />
          </div>
        )}
        
        {(transcript || interimTranscript) && (
          <div className="w-full mt-4 p-4 bg-gray-50 rounded-md max-h-40 overflow-y-auto border">
            <p className="text-sm text-gray-800">
              {transcript} 
              {interimTranscript && (
                <span className="text-gray-500 italic">{interimTranscript}</span>
              )}
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 text-center">
          {isSupported ? (
            "Make sure you're using HTTPS and have granted microphone permissions"
          ) : (
            "Speech recognition requires a supported browser and HTTPS"
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInputController;