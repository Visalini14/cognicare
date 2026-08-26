import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, type LanguageCode, type LanguageInfo } from '../types/language';
import { UI_TRANSLATIONS, PAGE_GUIDANCE, ROUTE_GUIDANCE_MAP, GLOBAL_NAVIGATION_COMMANDS, type UiTranslations } from '../data/translations';
import { synthesizeGoogleSpeech, getGoogleTtsApiKey, setGoogleTtsApiKey, isGoogleTtsAvailable } from '../services/googleTts';
import { loadFreeSpeechEngine, stopInstantFreeSpeech } from '../services/freeTts';
import { synthesizeBhashiniSpeech, getBhashiniCredentials, setBhashiniCredentials, isBhashiniAvailable } from '../services/bhashiniTts';
import { stopGoogleTranslateSpeech } from '../services/googleTranslateTts';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (lang: LanguageCode) => void;
  ui: UiTranslations;
  isAutoVoiceEnabled: boolean;
  toggleAutoVoice: () => void;
  isSpeaking: boolean;
  speakText: (text: string, force?: boolean) => void;
  stopSpeech: () => void;
  speakPageGuidance: (overrideRoute?: string) => void;
  currentPageTitle: string;
  currentPageGuidanceText: string;
  isListeningForCommand: boolean;
  startVoiceCommandListener: () => void;
  stopVoiceCommandListener: () => void;
  commandTranscript: string;
  commandFeedback: string | null;
  googleApiKey: string;
  updateGoogleApiKey: (key: string) => void;
  isNeuralTtsActive: boolean;
  bhashiniApiKey: string;
  bhashiniUserId: string;
  updateBhashiniCredentials: (apiKey: string, userId: string) => void;
  isBhashiniActive: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('cognicare_language');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('cognicare_auto_voice');
    return saved !== null ? saved === 'true' : true;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListeningForCommand, setIsListeningForCommand] = useState<boolean>(false);
  const [commandTranscript, setCommandTranscript] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string>(getGoogleTtsApiKey());
  const [bhashiniCreds, setBhashiniCredsState] = useState(getBhashiniCredentials());

  const location = useLocation();
  const navigate = useNavigate();

  const recognitionRef = useRef<any>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const ui = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  useEffect(() => {
    loadFreeSpeechEngine().catch(e => console.warn('Free speech load notice:', e));

    const unlockAudio = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('cognicare_language', lang);
  };

  const toggleAutoVoice = () => {
    setIsAutoVoiceEnabled(prev => {
      const next = !prev;
      localStorage.setItem('cognicare_auto_voice', String(next));
      return next;
    });
  };

  const updateGoogleApiKey = (key: string) => {
    setGoogleTtsApiKey(key);
    setGoogleApiKey(key.trim());
  };

  const updateBhashiniCredentials = (apiKey: string, userId: string) => {
    setBhashiniCredentials(apiKey, userId);
    setBhashiniCredsState({ apiKey: apiKey.trim(), userId: userId.trim() });
  };

  // STOP SPEECH
  const stopSpeech = useCallback(() => {
    stopInstantFreeSpeech();
    stopGoogleTranslateSpeech();

    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      activeAudioRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // SPEAK TEXT (Text-to-Speech)
  const speakText = useCallback(async (text: string, _force: boolean = false) => {
    stopSpeech();

    if (!text || text.trim().length === 0) return;

    // 1. Attempt Bhashini API (AI4Bharat IndicTTS) if credentials configured
    if (isBhashiniAvailable()) {
      setIsSpeaking(true);
      const audio = await synthesizeBhashiniSpeech(text, languageInfo.code);
      if (audio) {
        activeAudioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          activeAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          activeAudioRef.current = null;
        };
        audio.play().catch(err => {
          console.warn('Bhashini Audio playback error:', err);
          setIsSpeaking(false);
        });
        return;
      }
    }

    // 2. Attempt Google Cloud Neural Text-to-Speech if API key configured
    if (isGoogleTtsAvailable()) {
      setIsSpeaking(true);
      const audio = await synthesizeGoogleSpeech(text, languageInfo.speechTag);
      if (audio) {
        activeAudioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          activeAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          activeAudioRef.current = null;
        };
        audio.play().catch(err => {
          console.warn('Audio playback error:', err);
          setIsSpeaking(false);
        });
        return;
      }
    }

    // 3. Native High-Performance Browser Web Speech Synthesis
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageInfo.speechTag;
      utterance.rate = 0.92; // Slightly slower for elderly comprehension
      utterance.pitch = 1.0;

      // Attempt to pick an authentic Indian accent / native voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = languageInfo.code.toLowerCase();
        const tagLower = languageInfo.speechTag.toLowerCase().replace('_', '-');

        // Priority 1: Exact locale match (e.g. ta-IN, hi-IN, en-IN)
        let chosenVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === tagLower);

        // Priority 2: Voice containing India or native name (e.g. "Google தமிழ்", "Microsoft Valluvar", "Google हिन्दी")
        if (!chosenVoice) {
          chosenVoice = voices.find(v => {
            const vLang = v.lang.toLowerCase().replace('_', '-');
            const vName = v.name.toLowerCase();
            return (vLang.startsWith(langPrefix) || vLang.includes('in')) && 
              (vName.includes('india') || vName.includes('tamil') || vName.includes('hindi') || vName.includes('google') || vName.includes('microsoft'));
          });
        }

        // Priority 3: Any voice matching language prefix
        if (!chosenVoice) {
          chosenVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
        }

        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);

      // Fix Chrome stuck pause bug
      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 80);

    } catch (e) {
      console.warn('Speech synthesis invocation error:', e);
      setIsSpeaking(false);
    }
  }, [languageInfo, stopSpeech]);

  // GET PAGE GUIDANCE CONTENT
  const getGuidanceForRoute = (pathname: string) => {
    const key = ROUTE_GUIDANCE_MAP[pathname] || 'patient_dashboard';
    const langDict = PAGE_GUIDANCE[key];
    if (langDict && langDict[currentLanguage]) {
      return langDict[currentLanguage];
    }
    if (langDict && langDict.en) {
      return langDict.en;
    }
    return {
      title: 'CogniCare Platform',
      guidanceText: 'Welcome to CogniCare. Select an activity or view your progress from the navigation bar.',
    };
  };

  const currentGuidance = getGuidanceForRoute(location.pathname);

  // SPEAK PAGE GUIDANCE
  const speakPageGuidance = useCallback((overrideRoute?: string) => {
    const path = overrideRoute || location.pathname;
    const info = getGuidanceForRoute(path);
    speakText(info.guidanceText);
  }, [location.pathname, currentLanguage, speakText]);

  // AUTO-PLAY VOICE GUIDANCE ON ROUTE CHANGE
  useEffect(() => {
    if (isAutoVoiceEnabled) {
      // Small timeout to allow page component render before audio starts
      const timer = setTimeout(() => {
        speakPageGuidance();
      }, 500);

      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    } else {
      stopSpeech();
    }
  }, [location.pathname, currentLanguage, isAutoVoiceEnabled]);

  // VOICE COMMAND RECOGNITION SYSTEM
  const stopVoiceCommandListener = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
    setIsListeningForCommand(false);
  }, []);

  const startVoiceCommandListener = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setCommandFeedback('Voice recognition is not supported in this browser.');
      return;
    }

    stopSpeech(); // Pause any ongoing speech while listening

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = languageInfo.speechTag;

      recognition.onstart = () => {
        setIsListeningForCommand(true);
        setCommandTranscript('');
        setCommandFeedback(ui.listeningVoiceCommand);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript.toLowerCase().trim();
        setCommandTranscript(spoken);
        setIsListeningForCommand(false);

        // Check for special commands
        if (
          spoken.includes('read') ||
          spoken.includes('guide') ||
          spoken.includes('speak') ||
          spoken.includes('படி') ||
          spoken.includes('சொல்') ||
          spoken.includes('पढ़ो') ||
          spoken.includes('बताओ')
        ) {
          setCommandFeedback(ui.voiceCommandSuccess);
          speakPageGuidance();
          return;
        }

        if (
          spoken.includes('stop') ||
          spoken.includes('quiet') ||
          spoken.includes('நிறுத்து') ||
          spoken.includes('அமைதி') ||
          spoken.includes('रुको') ||
          spoken.includes('शांत')
        ) {
          stopSpeech();
          setCommandFeedback('Speech stopped.');
          return;
        }

        // Match route navigation
        let matchedRoute: string | null = null;
        for (const cmd of GLOBAL_NAVIGATION_COMMANDS) {
          if (cmd.keywords.some(kw => spoken.includes(kw))) {
            matchedRoute = cmd.route;
            break;
          }
        }

        if (matchedRoute) {
          setCommandFeedback(`${ui.voiceCommandSuccess} -> ${matchedRoute}`);
          speakText(`Opening ${spoken}`, true);
          navigate(matchedRoute);
        } else {
          setCommandFeedback(`${ui.voiceCommandError} ("${spoken}")`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice command recognition error:', event.error);
        setIsListeningForCommand(false);
        setCommandFeedback(ui.voiceCommandError);
      };

      recognition.onend = () => {
        setIsListeningForCommand(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Failed to start voice command recognition', e);
      setIsListeningForCommand(false);
      setCommandFeedback('Could not activate microphone for command.');
    }
  }, [languageInfo, ui, navigate, speakPageGuidance, stopSpeech, speakText]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageInfo,
        setLanguage,
        ui,
        isAutoVoiceEnabled,
        toggleAutoVoice,
        isSpeaking,
        speakText,
        stopSpeech,
        speakPageGuidance,
        currentPageTitle: currentGuidance.title,
        currentPageGuidanceText: currentGuidance.guidanceText,
        isListeningForCommand,
        startVoiceCommandListener,
        stopVoiceCommandListener,
        commandTranscript,
        commandFeedback,
        googleApiKey,
        updateGoogleApiKey,
        isNeuralTtsActive: isGoogleTtsAvailable(),
        bhashiniApiKey: bhashiniCreds.apiKey,
        bhashiniUserId: bhashiniCreds.userId,
        updateBhashiniCredentials,
        isBhashiniActive: isBhashiniAvailable(),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
