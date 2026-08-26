import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GLOBAL_NAVIGATION_COMMANDS } from '../../data/translations';
import { Mic, Volume2, X } from 'lucide-react';

export const GlobalVoiceController: React.FC = () => {
  const { logout, toggleHighContrast } = useAuth();
  const { languageInfo, speakPageGuidance, stopSpeech, speakText } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isActive, setIsActive] = useState<boolean>(() => {
    return localStorage.getItem('cognicare_global_voice_active') === 'true';
  });

  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('cognicare_global_voice_active', String(isActive));
  }, [isActive]);

  const handleGlobalCommand = (spokenRaw: string) => {
    const spoken = spokenRaw.toLowerCase().trim();
    setTranscript(spoken);

    // 1. Voice Control OFF command
    if (spoken.includes('voice off') || spoken.includes('stop voice mode') || spoken.includes('disable voice')) {
      setIsActive(false);
      speakText('Hands-free voice control turned off');
      return;
    }

    // 2. High Contrast toggle command
    if (spoken.includes('high contrast') || spoken.includes('contrast') || spoken.includes('கான்ட்ராஸ்ட்')) {
      toggleHighContrast();
      setFeedback('Toggled High Contrast Mode');
      speakText('Toggled High Contrast Mode');
      return;
    }

    // 3. Read page guidance command
    if (spoken.includes('read page') || spoken.includes('read screen') || spoken.includes('speak page') || spoken.includes('படி') || spoken.includes('पढ़ो')) {
      setFeedback('Reading page guidance aloud');
      speakPageGuidance();
      return;
    }

    // 4. Stop speech command
    if (spoken.includes('stop speech') || spoken.includes('quiet') || spoken.includes('நிறுத்து') || spoken.includes('रुको')) {
      stopSpeech();
      setFeedback('Stopped speech');
      return;
    }

    // 5. Logout command
    if (spoken.includes('sign out') || spoken.includes('logout') || spoken.includes('வெளியேறு')) {
      logout();
      navigate('/login');
      speakText('Signed out');
      return;
    }

    // 6. Start Activity / Start Match command
    if (
      spoken.includes('start activity') ||
      spoken.includes('start match') ||
      spoken.includes('start game') ||
      spoken.includes('start') ||
      spoken.includes('begin') ||
      spoken.includes('விளையாட்டைத் தொடங்கு') ||
      spoken.includes('தொடங்கு')
    ) {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find((b) => {
        const text = (b.textContent || '').toLowerCase();
        return text.includes('start') || text.includes('begin') || text.includes('தொடங்கு');
      });

      if (startBtn) {
        setFeedback('Starting Activity...');
        speakText('Starting activity');
        (startBtn as HTMLButtonElement).click();
        return;
      }
    }

    // 7. Back / Go Back command
    if (spoken === 'back' || spoken.includes('go back') || spoken.includes('திரும்பிச் செல்')) {
      const buttons = Array.from(document.querySelectorAll('button'));
      const backBtn = buttons.find((b) => {
        const text = (b.textContent || '').toLowerCase();
        return text === 'back' || text.includes('back to') || text.includes('cancel');
      });

      if (backBtn) {
        setFeedback('Going Back...');
        speakText('Going back');
        (backBtn as HTMLButtonElement).click();
        return;
      } else {
        navigate(-1);
        return;
      }
    }

    // 8. Navigation route match
    let matchedRoute: string | null = null;
    for (const cmd of GLOBAL_NAVIGATION_COMMANDS) {
      if (cmd.keywords.some((kw) => spoken.includes(kw.toLowerCase()))) {
        matchedRoute = cmd.route;
        break;
      }
    }

    if (matchedRoute && matchedRoute !== location.pathname) {
      setFeedback(`Navigating -> ${matchedRoute}`);
      speakText(`Opening ${spoken}`, true);
      navigate(matchedRoute);
    } else if (matchedRoute === location.pathname) {
      setFeedback(`Already on ${spoken}`);
    } else {
      setFeedback(`Command not matched: "${spoken}"`);
    }
  };

  // Continuous speech recognition loop when isActive === true
  useEffect(() => {
    if (!isActive) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsActive(false);
      return;
    }

    let isComponentMounted = true;

    const startContinuousListening = () => {
      if (!isComponentMounted) return;

      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = languageInfo.speechTag || 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          if (text) {
            handleGlobalCommand(text);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Global voice listener error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Automatically restart continuous listening after 1 second if still active
          if (isComponentMounted && isActive) {
            restartTimerRef.current = setTimeout(() => {
              startContinuousListening();
            }, 1000);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn('Continuous speech start error', e);
        setIsListening(false);
      }
    };

    startContinuousListening();

    return () => {
      isComponentMounted = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [isActive, languageInfo, location.pathname]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="bg-emerald-700 text-white p-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white animate-pulse cursor-pointer"
          title="Voice Control Active — Click to expand"
        >
          <Mic className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-wider pr-1">Voice ON</span>
        </button>
      ) : (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border-2 border-emerald-500 max-w-xs space-y-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <Mic className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-sm text-emerald-300 uppercase tracking-wider">Hands-Free Voice ON</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(true)}
                className="text-slate-400 hover:text-white p-1 text-xs font-bold"
                title="Minimize"
              >
                _
              </button>
              <button
                onClick={() => setIsActive(false)}
                className="text-slate-400 hover:text-rose-400 p-1"
                title="Turn Off Voice Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {isListening ? '🎙️ Listening... Say any command (e.g. "Memory Game", "Dashboard", "High Contrast", "Read Page")' : 'Processing voice...'}
          </p>

          {transcript && (
            <div className="bg-slate-800 p-2 rounded-xl text-xs font-bold text-teal-300">
              Heard: "{transcript}"
            </div>
          )}

          {feedback && (
            <p className="text-[11px] font-bold text-amber-300 truncate">
              {feedback}
            </p>
          )}

          <div className="pt-1 flex justify-between items-center">
            <button
              onClick={() => speakPageGuidance()}
              className="text-[11px] font-extrabold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> Read Page Aloud
            </button>
            <button
              onClick={() => setIsActive(false)}
              className="text-[11px] font-bold text-rose-400 hover:underline cursor-pointer"
            >
              Turn OFF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
