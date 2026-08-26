// Google Cloud Text-to-Speech API Service for Neural Indian Accent Speech

const GOOGLE_VOICE_MAP: Record<string, { voiceName: string; ssmlGender: string }> = {
  'ta-IN': { voiceName: 'ta-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  'hi-IN': { voiceName: 'hi-IN-Neural2-A', ssmlGender: 'FEMALE' },
  'en-IN': { voiceName: 'en-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  'te-IN': { voiceName: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
  'kn-IN': { voiceName: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' },
  'ml-IN': { voiceName: 'ml-IN-Standard-A', ssmlGender: 'FEMALE' },
  'bn-IN': { voiceName: 'bn-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  'mr-IN': { voiceName: 'mr-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  'gu-IN': { voiceName: 'gu-IN-Standard-A', ssmlGender: 'FEMALE' },
  'pa-IN': { voiceName: 'pa-IN-Standard-A', ssmlGender: 'FEMALE' },
};

const audioCache = new Map<string, string>();

export const getGoogleTtsApiKey = (): string => {
  const stored = localStorage.getItem('cognicare_google_tts_api_key');
  if (stored && stored.trim().length > 0) {
    return stored.trim();
  }
  return (import.meta.env.VITE_GOOGLE_TTS_API_KEY || '').trim();
};

export const setGoogleTtsApiKey = (apiKey: string): void => {
  localStorage.setItem('cognicare_google_tts_api_key', apiKey.trim());
};

export const isGoogleTtsAvailable = (): boolean => {
  return getGoogleTtsApiKey().length > 0;
};

export const synthesizeGoogleSpeech = async (
  text: string,
  speechTag: string
): Promise<HTMLAudioElement | null> => {
  const apiKey = getGoogleTtsApiKey();
  if (!apiKey) return null;

  const cacheKey = `${speechTag}:${text}`;
  if (audioCache.has(cacheKey)) {
    const cachedUrl = audioCache.get(cacheKey)!;
    const audio = new Audio(cachedUrl);
    return audio;
  }

  const voiceConfig = GOOGLE_VOICE_MAP[speechTag] || {
    voiceName: `${speechTag}-Wavenet-A`,
    ssmlGender: 'FEMALE',
  };

  const payload = {
    input: { text },
    voice: {
      languageCode: speechTag,
      name: voiceConfig.voiceName,
      ssmlGender: voiceConfig.ssmlGender,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      pitch: 0.0,
    },
  };

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      console.warn('Google Cloud TTS API response error:', response.status, errJson);
      return null;
    }

    const data = await response.json();
    if (!data.audioContent) {
      return null;
    }

    const binary = atob(data.audioContent);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, audioUrl);

    const audio = new Audio(audioUrl);
    return audio;
  } catch (err) {
    console.warn('Google Cloud TTS fetch error:', err);
    return null;
  }
};
