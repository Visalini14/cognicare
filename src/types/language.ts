export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa';

export interface LanguageInfo {
  code: LanguageCode;
  speechTag: string; // BCP-47 tag for SpeechSynthesis & SpeechRecognition
  name: string;      // English name
  nativeName: string; // Native script name
  flagEmoji: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', speechTag: 'en-IN', name: 'English', nativeName: 'English', flagEmoji: '🇮🇳' },
  { code: 'ta', speechTag: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flagEmoji: '🇮🇳' },
  { code: 'hi', speechTag: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flagEmoji: '🇮🇳' },
  { code: 'te', speechTag: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flagEmoji: '🇮🇳' },
  { code: 'kn', speechTag: 'kn-IN', name: 'Kannada', nativeName: 'கன்னடா / ಕನ್ನಡ', flagEmoji: '🇮🇳' },
  { code: 'ml', speechTag: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flagEmoji: '🇮🇳' },
  { code: 'bn', speechTag: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flagEmoji: '🇮🇳' },
  { code: 'mr', speechTag: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flagEmoji: '🇮🇳' },
  { code: 'gu', speechTag: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flagEmoji: '🇮🇳' },
  { code: 'pa', speechTag: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flagEmoji: '🇮🇳' },
];
