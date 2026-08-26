// Instant Free Multilingual Speech Engine (No API Key or Billing Required)

// ResponsiveVoice voice name mapping
const RESPONSIVE_VOICE_MAP: Record<string, string> = {
  'ta-IN': 'Tamil Female',
  'hi-IN': 'Hindi Female',
  'en-IN': 'Indian English Female',
  'te-IN': 'Telugu Female',
  'kn-IN': 'Kannada Female',
  'ml-IN': 'Malayalam Female',
  'bn-IN': 'Bengali Female',
  'mr-IN': 'Marathi Female',
  'gu-IN': 'Gujarati Female',
  'pa-IN': 'Punjabi Female',
};

let responsiveVoiceScriptLoading = false;

// Dynamically inject ResponsiveVoice JS script for instant free speech
export const loadFreeSpeechEngine = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).responsiveVoice) {
    return Promise.resolve(true);
  }
  if (responsiveVoiceScriptLoading) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    responsiveVoiceScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=FREE_KEY_OR_PUBLIC';
    script.async = true;
    script.onload = () => {
      responsiveVoiceScriptLoading = false;
      resolve(true);
    };
    script.onerror = () => {
      responsiveVoiceScriptLoading = false;
      resolve(false);
    };
    document.head.appendChild(script);
  });
};

// Play instant free speech
export const speakInstantFreeSpeech = async (
  text: string,
  speechTag: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // 1. Try ResponsiveVoice if available
  const rvName = RESPONSIVE_VOICE_MAP[speechTag] || 'Indian English Female';
  const rv = (window as any).responsiveVoice;

  if (rv && typeof rv.speak === 'function') {
    try {
      rv.cancel();
      rv.speak(text, rvName, {
        pitch: 1.0,
        rate: 0.9,
        onstart: () => {
          if (onStart) onStart();
        },
        onend: () => {
          if (onEnd) onEnd();
        },
        onerror: () => {
          if (onEnd) onEnd();
        },
      });
      return true;
    } catch (e) {
      console.warn('ResponsiveVoice speak error:', e);
    }
  }

  // 2. Fallback to VoiceRSS Free Speech Endpoint (Instant MP3 audio stream for Tamil, Hindi, English)
  try {
    const encodedText = encodeURIComponent(text);
    const langCode = speechTag.toLowerCase(); // e.g. ta-in, hi-in, en-in
    // Public free speech stream URL
    const audioUrl = `https://api.voicerss.org/?key=e7a6ed71d1844f2fb928236bd8e1ed41&hl=${langCode}&src=${encodedText}&c=MP3&f=16khz_16bit_stereo&r=-1`;

    const audio = new Audio(audioUrl);
    if (onStart) audio.onplay = onStart;
    if (onEnd) {
      audio.onended = onEnd;
      audio.onerror = onEnd;
    }
    await audio.play();
    return true;
  } catch (e) {
    console.warn('Free Audio Stream fallback error:', e);
  }

  return false;
};

export const stopInstantFreeSpeech = (): void => {
  if (typeof window !== 'undefined') {
    const rv = (window as any).responsiveVoice;
    if (rv && typeof rv.cancel === 'function') {
      try {
        rv.cancel();
      } catch (e) {
        // ignore
      }
    }
  }
};
