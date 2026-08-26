import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../types/language';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean; direction?: 'up' | 'down' }> = ({
  compact = false,
  direction = 'down',
}) => {
  const { currentLanguage, setLanguage, languageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const positionClass = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 font-extrabold text-slate-800 bg-white hover:bg-slate-100 border-2 border-slate-300 rounded-2xl shadow-sm transition-all cursor-pointer ${
          compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm sm:text-base'
        }`}
        title="Select Website & Voice Language"
      >
        <Globe className={`text-teal-700 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <span className="font-bold">{languageInfo.flagEmoji}</span>
        <span>{languageInfo.nativeName}</span>
        <ChevronDown className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''} ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 ${positionClass} w-64 rounded-3xl bg-white border-3 border-teal-200 shadow-2xl z-50 overflow-hidden animate-fadeIn`}>
          <div className="p-3 bg-teal-50 border-b border-teal-100">
            <p className="text-xs font-black uppercase text-teal-800 tracking-wider">Select Language / மொழி / भाषा</p>
            <p className="text-[11px] font-semibold text-slate-600">Updates text & voice guidance</p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer hover:bg-teal-50 ${
                    isSelected ? 'bg-teal-100 text-teal-900 font-black' : 'text-slate-700 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flagEmoji}</span>
                    <div>
                      <p className="text-sm leading-tight font-extrabold">{lang.nativeName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{lang.name}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-teal-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
