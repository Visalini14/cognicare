// Bhashini API (AI4Bharat IndicTTS) Service for Government of India AI Speech Synthesis

export interface BhashiniCredentials {
  apiKey: string;
  userId: string;
}

const bhashiniAudioCache = new Map<string, string>();

export const getBhashiniCredentials = (): BhashiniCredentials => {
  const storedKey = localStorage.getItem('cognicare_bhashini_api_key') || '';
  const storedUser = localStorage.getItem('cognicare_bhashini_user_id') || '';
  const envKey = import.meta.env.VITE_BHASHINI_API_KEY || '';
  const envUser = import.meta.env.VITE_BHASHINI_USER_ID || '';

  return {
    apiKey: (storedKey || envKey).trim(),
    userId: (storedUser || envUser).trim(),
  };
};

export const setBhashiniCredentials = (apiKey: string, userId: string): void => {
  localStorage.setItem('cognicare_bhashini_api_key', apiKey.trim());
  localStorage.setItem('cognicare_bhashini_user_id', userId.trim());
};

export const isBhashiniAvailable = (): boolean => {
  const creds = getBhashiniCredentials();
  return creds.apiKey.length > 0;
};

export const synthesizeBhashiniSpeech = async (
  text: string,
  langCode: string // e.g. 'ta', 'hi', 'en', 'te', 'kn', 'ml', etc.
): Promise<HTMLAudioElement | null> => {
  const creds = getBhashiniCredentials();
  if (!creds.apiKey) return null;

  const cacheKey = `bhashini:${langCode}:${text}`;
  if (bhashiniAudioCache.has(cacheKey)) {
    const cachedUrl = bhashiniAudioCache.get(cacheKey)!;
    return new Audio(cachedUrl);
  }

  const payload = {
    pipelineTasks: [
      {
        taskType: 'tts',
        config: {
          language: {
            sourceLanguage: langCode,
          },
          serviceId: 'ai4bharat/indic-tts',
          gender: 'female',
          samplingRate: 22050,
        },
      },
    ],
    inputData: {
      input: [
        {
          source: text,
        },
      ],
    },
  };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': creds.apiKey,
    };
    if (creds.userId) {
      headers['user-id'] = creds.userId;
    }

    const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('Bhashini API HTTP error:', response.status);
      return null;
    }

    const data = await response.json();
    const base64Audio =
      data?.pipelineResponse?.[0]?.output?.[0]?.audio?.[0]?.audioContent;

    if (!base64Audio) {
      console.warn('Bhashini API did not return audioContent');
      return null;
    }

    const binary = atob(base64Audio);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([array], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(blob);
    bhashiniAudioCache.set(cacheKey, audioUrl);

    return new Audio(audioUrl);
  } catch (err) {
    console.warn('Bhashini API fetch exception:', err);
    return null;
  }
};
