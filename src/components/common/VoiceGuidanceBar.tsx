import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, VolumeX, Mic, Square, Play, Sparkles, ChevronUp, ChevronDown, Radio, Key, CheckCircle2 } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const VoiceGuidanceBar: React.FC = () => {
  const {
    ui,
    languageInfo,
    isSpeaking,
    speakPageGuidance,
    stopSpeech,
    isAutoVoiceEnabled,
    toggleAutoVoice,
    currentPageTitle,
    currentPageGuidanceText,
    isListeningForCommand,
    startVoiceCommandListener,
    commandTranscript,
    commandFeedback,
    googleApiKey,
    updateGoogleApiKey,
    isNeuralTtsActive,
    bhashiniApiKey,
    bhashiniUserId,
    updateBhashiniCredentials,
    isBhashiniActive,
  } = useLanguage();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState(googleApiKey);
  const [bKey, setBKey] = useState(bhashiniApiKey);
  const [bUser, setBUser] = useState(bhashiniUserId);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoogleApiKey(inputKey);
    updateBhashiniCredentials(bKey, bUser);
    setShowKeyModal(false);
  };

  return (
    <>
      <aside aria-label="Voice Assistant Controls" className="fixed bottom-4 right-4 z-50 max-w-md w-[92vw] sm:w-[440px] shadow-2xl transition-all duration-300">
        <div className={`bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl border-3 border-teal-400 p-4 shadow-2xl ${isMinimized ? 'py-3' : 'py-4'}`}>
          
          {/* HEADER BAR */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-2xl flex items-center justify-center ${isSpeaking ? 'bg-amber-500 animate-bounce' : 'bg-teal-700'}`}>
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {ui.voiceGuidanceTitle}
                  </span>
                  <span className="text-[10px] font-extrabold bg-teal-800 text-teal-200 px-2 py-0.5 rounded-full border border-teal-600">
                    {languageInfo.nativeName}
                  </span>
                  {isBhashiniActive ? (
                    <span className="text-[10px] font-black bg-orange-600 text-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-orange-400">
                      <CheckCircle2 className="w-3 h-3" /> Bhashini AI
                    </span>
                  ) : isNeuralTtsActive ? (
                    <span className="text-[10px] font-black bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500">
                      <CheckCircle2 className="w-3 h-3" /> Neural AI
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-teal-950 text-teal-300 px-2 py-0.5 rounded-full border border-teal-700">
                      Instant Speech
                    </span>
                  )}
                </div>
                <p className="text-sm font-extrabold text-white truncate max-w-[200px]">
                  {currentPageTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKeyModal(true)}
                className="p-2 text-amber-300 hover:text-amber-200 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Configure Bhashini or Google Cloud Speech Keys"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title={isMinimized ? 'Expand Voice Controls' : 'Minimize Voice Controls'}
              >
                {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* EXPANDED CONTENT BODY */}
          {!isMinimized && (
            <div className="mt-3 pt-3 border-t border-teal-800/80 space-y-3">
              
              {/* CURRENT GUIDANCE TEXT & ACTIVE SPEECH INDICATOR */}
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-teal-700/50 relative overflow-hidden">
                {isSpeaking && (
                  <div className="flex items-center gap-1.5 mb-2 text-amber-300 text-xs font-bold animate-pulse">
                    <Radio className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>{ui.voiceGuidanceActive}</span>
                    <div className="flex items-end gap-0.5 ml-auto h-3">
                      <span className="w-1 h-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-3/4 bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-semibold">
                  "{currentPageGuidanceText}"
                </p>

                {/* VOICE COMMAND FEEDBACK */}
                {(commandFeedback || commandTranscript) && (
                  <div className="mt-2 p-2 bg-teal-900/90 text-teal-200 text-xs font-bold rounded-xl border border-teal-500/40">
                    {commandTranscript && <p className="italic text-amber-300">"{commandTranscript}"</p>}
                    {commandFeedback && <p>{commandFeedback}</p>}
                  </div>
                )}
              </div>

              {/* CONTROL ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                
                {/* PLAY / REPLAY GUIDANCE */}
                <button
                  type="button"
                  onClick={() => speakPageGuidance()}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer border border-teal-400/40"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{ui.listenPageGuidance}</span>
                </button>

                {/* STOP SPEECH */}
                <button
                  type="button"
                  onClick={stopSpeech}
                  disabled={!isSpeaking}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer border ${
                    isSpeaking
                      ? 'bg-rose-700 hover:bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>{ui.stopSpeech}</span>
                </button>

                {/* VOICE COMMAND LISTENER */}
                <button
                  type="button"
                  onClick={startVoiceCommandListener}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer border ${
                    isListeningForCommand
                      ? 'bg-rose-600 text-white animate-pulse border-rose-300'
                      : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isListeningForCommand ? 'Listening...' : ui.voiceCommandPrompt}</span>
                </button>

                {/* AUTO VOICE TOGGLE */}
                <button
                  type="button"
                  onClick={toggleAutoVoice}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer border ${
                    isAutoVoiceEnabled
                      ? 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isAutoVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isAutoVoiceEnabled ? ui.autoSpeechOn : ui.autoSpeechOff}</span>
                </button>

              </div>

              {/* LANGUAGE SELECTOR AT FOOTER OF VOICE BAR */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-300 font-bold">Default Voice Language:</span>
                <LanguageSelector compact direction="up" />
              </div>

            </div>
          )}
        </div>
      </aside>

      {/* AI SPEECH ENGINE SETTINGS MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border-3 border-teal-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-6 h-6 text-teal-700" />
                <h3 className="text-lg font-black text-slate-900">AI Speech Engine Keys</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              CogniCare includes <strong>Instant Free Speech</strong> out of the box. You can optionally enter <strong>Government of India Bhashini API</strong> or <strong>Google Cloud TTS</strong> credentials for AI Indic voices.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              {/* BHASHINI SECTION */}
              <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 space-y-3">
                <h4 className="text-xs font-black text-orange-900 uppercase tracking-wider">
                  1. Bhashini API (AI4Bharat IndicTTS)
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bhashini Authorization Key
                  </label>
                  <input
                    type="password"
                    value={bKey}
                    onChange={(e) => setBKey(e.target.value)}
                    placeholder="Bhashini Authorization Header Token"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bhashini User ID
                  </label>
                  <input
                    type="text"
                    value={bUser}
                    onChange={(e) => setBUser(e.target.value)}
                    placeholder="User ID (optional)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* GOOGLE CLOUD TTS SECTION */}
              <div className="p-4 bg-teal-50 rounded-2xl border-2 border-teal-200 space-y-3">
                <h4 className="text-xs font-black text-teal-900 uppercase tracking-wider">
                  2. Google Cloud TTS API Key
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Google Cloud API Key
                  </label>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


