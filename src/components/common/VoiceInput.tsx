import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, RotateCcw, Volume2, AlertCircle } from 'lucide-react';
import { Button } from './UIComponents';
import { useLanguage } from '../../context/LanguageContext';

interface VoiceInputProps {
  onConfirmAnswer: (spokenText: string) => void;
  disabled?: boolean;
  promptText?: string;
}

// Web Speech API interface declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onConfirmAnswer,
  disabled = false,
  promptText = 'Speak your answer',
}) => {
  const { languageInfo, stopSpeech } = useLanguage();
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error' | 'permission_denied'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Detect Web Speech API availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = languageInfo.speechTag;

      recognition.onstart = () => {
        setStatus('listening');
        setErrorMessage('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setStatus('processing');
        const text = event.results[0][0].transcript;
        if (text && text.trim().length > 0) {
          setTranscript(text.trim());
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage("We couldn't hear that clearly. Please try again.");
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setStatus('permission_denied');
          setErrorMessage('Microphone access is unavailable. You can use the buttons instead.');
        } else if (event.error === 'no-speech') {
          setStatus('error');
          setErrorMessage("We couldn't hear any speech. Please try again.");
        } else {
          setStatus('error');
          setErrorMessage("Speech recognition encountered an issue. Please try again or tap an answer button.");
        }
      };

      recognition.onend = () => {
        // If still listening without result, reset to idle/error
        setStatus(prev => (prev === 'listening' || prev === 'processing' ? 'error' : prev));
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech Recognition initialization error', e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore cleanup abort errors
        }
      }
    };
  }, [languageInfo]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current || disabled) return;
    try {
      stopSpeech();
      recognitionRef.current.lang = languageInfo.speechTag;
      setTranscript('');
      setStatus('listening');
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Start speech error', e);
      setStatus('error');
      setErrorMessage("Could not start microphone. Please try tapping an answer button.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setStatus('idle');
  };

  const handleConfirm = () => {
    if (transcript) {
      onConfirmAnswer(transcript);
      setStatus('idle');
      setTranscript('');
    }
  };

  const handleRetry = () => {
    setTranscript('');
    setStatus('idle');
    startListening();
  };

  // If Web Speech API is unsupported in browser, show helpful fallback message
  if (!isSupported) {
    return (
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 text-center text-sm font-semibold text-slate-600">
        <Volume2 className="w-5 h-5 mx-auto mb-1 text-slate-400" />
        Voice input is not supported on this browser. You can use the answer buttons below!
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto my-6 text-center space-y-4">
      {/* IDLE STATE: LARGE ELDERLY-FRIENDLY VOICE BUTTON */}
      {status === 'idle' && (
        <Button
          type="button"
          variant="secondary"
          size="xl"
          icon={Mic}
          onClick={startListening}
          disabled={disabled}
          fullWidth
        >
          {promptText}
        </Button>
      )}

      {/* LISTENING STATE */}
      {status === 'listening' && (
        <div className="p-6 bg-rose-50 border-3 border-rose-300 rounded-3xl space-y-4 shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-3 text-rose-800 font-black text-xl">
            <span className="w-4 h-4 rounded-full bg-rose-600 animate-ping" />
            Listening to your voice...
          </div>
          <p className="text-sm font-bold text-slate-700">Speak clearly into your microphone now.</p>
          <Button variant="outline" size="md" icon={MicOff} onClick={stopListening}>
            Cancel Listening
          </Button>
        </div>
      )}

      {/* PROCESSING STATE */}
      {status === 'processing' && (
        <div className="p-6 bg-indigo-50 border-3 border-indigo-300 rounded-3xl text-center space-y-2">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-lg font-extrabold text-indigo-900">Understanding your answer...</p>
        </div>
      )}

      {/* SUCCESS CONFIRMATION STATE (NO AUTO-SUBMIT) */}
      {status === 'success' && (
        <div className="p-6 bg-emerald-50 border-3 border-emerald-300 rounded-3xl space-y-5 shadow-xl text-center">
          <div>
            <p className="text-xs font-black uppercase text-emerald-800 tracking-wider">Voice Recognized</p>
            <h4 className="text-3xl font-black text-slate-900 mt-1">"{transcript}"</h4>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" icon={Check} onClick={handleConfirm} fullWidth>
              Use This Answer
            </Button>
            <Button variant="outline" size="lg" icon={RotateCcw} onClick={handleRetry} fullWidth>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {status === 'error' && (
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-3">
          <p className="text-base font-extrabold text-amber-900">{errorMessage}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="md" icon={RotateCcw} onClick={handleRetry}>
              Try Speaking Again
            </Button>
          </div>
        </div>
      )}

      {/* PERMISSION DENIED STATE */}
      {status === 'permission_denied' && (
        <div className="p-5 bg-slate-100 border-2 border-slate-300 rounded-3xl text-slate-700 space-y-2">
          <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800">{errorMessage}</p>
          <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};
