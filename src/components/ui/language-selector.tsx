'use client';

import { useState } from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

const LANGUAGE_OPTIONS = [
  // Bengali (Bangla) - Primary languages
  { code: 'bn-BD', name: 'বাংলা (Bangladesh)', native: 'বাংলা' },
  { code: 'bn-IN', name: 'বাংলা (India)', native: 'বাংলা' },
  
  // English variants
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'en-AU', name: 'English (Australia)' },
  { code: 'en-CA', name: 'English (Canada)' },
  { code: 'en-IN', name: 'English (India)' },
  { code: 'en-NZ', name: 'English (New Zealand)' },
  { code: 'en-ZA', name: 'English (South Africa)' },
  
  // Other languages
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'fr-CA', name: 'French (Canada)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'th-TH', name: 'Thai' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'sv-SE', name: 'Swedish' },
  { code: 'no-NO', name: 'Norwegian' },
  { code: 'da-DK', name: 'Danish' },
  { code: 'fi-FI', name: 'Finnish' },
  { code: 'pl-PL', name: 'Polish' },
  { code: 'tr-TR', name: 'Turkish' },
  { code: 'cs-CZ', name: 'Czech' },
  { code: 'sk-SK', name: 'Slovak' },
  { code: 'hu-HU', name: 'Hungarian' },
  { code: 'ro-RO', name: 'Romanian' },
  { code: 'bg-BG', name: 'Bulgarian' },
  { code: 'hr-HR', name: 'Croatian' },
  { code: 'sl-SI', name: 'Slovenian' },
  { code: 'et-EE', name: 'Estonian' },
  { code: 'lv-LV', name: 'Latvian' },
  { code: 'lt-LT', name: 'Lithuanian' },
  { code: 'uk-UA', name: 'Ukrainian' },
  { code: 'el-GR', name: 'Greek' },
  { code: 'he-IL', name: 'Hebrew' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'ms-MY', name: 'Malay' },
  { code: 'vi-VN', name: 'Vietnamese' },
];

export function LanguageSelector({ currentLanguage, onLanguageChange, className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = LANGUAGE_OPTIONS.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lang as any).native?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLanguageData = LANGUAGE_OPTIONS.find(lang => lang.code === currentLanguage);
  const currentLanguageName = currentLanguageData?.name || currentLanguage;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors"
      >
        <span className="text-slate-200">{currentLanguageName}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-2 border-b border-slate-600">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-700 transition-colors ${
                  language.code === currentLanguage
                    ? 'bg-blue-600/20 text-blue-200'
                    : 'text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{language.name}</span>
                    {(language as any).native && (
                      <span className="text-xs text-slate-400">{(language as any).native}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{language.code}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
