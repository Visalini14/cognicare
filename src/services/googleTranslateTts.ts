// Google Translate TTS Service (100% Free, Zero API Key, Instant Human Voice for Indian Languages)

const GOOGLE_TL_MAP: Record<string, string> = {
  'en': 'en-IN',
  'en-IN': 'en-IN',
  'ta': 'ta',
  'ta-IN': 'ta',
  'hi': 'hi',
  'hi-IN': 'hi',
  'te': 'te',
  'te-IN': 'te',
  'kn': 'kn',
  'kn-IN': 'kn',
  'ml': 'ml',
  'ml-IN': 'ml',
  'bn': 'bn',
  'bn-IN': 'bn',
  'mr': 'mr',
  'mr-IN': 'mr',
  'gu': 'gu',
  'gu-IN': 'gu',
  'pa': 'pa',
  'pa-IN': 'pa',
};

let currentAudio: HTMLAudioElement | null = null;
let isCancelled = false;

export const stopGoogleTranslateSpeech = (): void => {
  isCancelled = true;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      // ignore
    }
    currentAudio = null;
  }
};

// Split long text into sentence chunks under 180 chars for Google Translate TTS
const splitTextIntoChunks = (text: string, maxLength: number = 170): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + sentence.trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (sentence.length > maxLength) {
        // Sub-split very long sentences by comma
        const commaParts = sentence.split(',');
        for (const part of commaParts) {
          if ((currentChunk + part).length <= maxLength) {
            currentChunk += (currentChunk ? ', ' : '') + part.trim();
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = part.trim();
          }
        }
      } else {
        currentChunk = sentence.trim();
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

export const speakGoogleTranslateSpeech = async (
  text: string,
  langCodeOrTag: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> => {
  stopGoogleTranslateSpeech();
  isCancelled = false;

  const tl = GOOGLE_TL_MAP[langCodeOrTag] || GOOGLE_TL_MAP[langCodeOrTag.slice(0, 2)] || 'ta';
  const chunks = splitTextIntoChunks(text);

  if (chunks.length === 0) return false;

  if (onStart) onStart();

  for (let i = 0; i < chunks.length; i++) {
    if (isCancelled) break;

    const chunk = chunks[i];
    const encodedText = encodeURIComponent(chunk);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tl}&client=tw-ob`;

    const success = await new Promise<boolean>((resolve) => {
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onended = () => {
        currentAudio = null;
        resolve(true);
      };

      audio.onerror = (e) => {
        console.warn('Google Translate TTS chunk playback error:', e);
        currentAudio = null;
        resolve(false);
      };

      audio.play().catch((err) => {
        console.warn('Google Translate TTS audio play error:', err);
        currentAudio = null;
        resolve(false);
      });
    });

    if (!success || isCancelled) break;
  }

  if (onEnd) onEnd();
  return true;
};
