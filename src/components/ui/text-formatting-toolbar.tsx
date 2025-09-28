'use client';

import { useState } from 'react';

interface TextFormattingToolbarProps {
  onInsertText: (text: string) => void;
  disabled?: boolean;
}

export function TextFormattingToolbar({ onInsertText, disabled = false }: TextFormattingToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatOptions = [
    { label: 'New Paragraph', text: '\n\n', icon: '¶' },
    { label: 'New Line', text: '\n', icon: '↵' },
    { label: 'Comma', text: ', ', icon: ',' },
    { label: 'Period', text: '. ', icon: '.' },
    { label: 'Question Mark', text: '? ', icon: '?' },
    { label: 'Exclamation', text: '! ', icon: '!' },
    { label: 'Colon', text: ': ', icon: ':' },
    { label: 'Semicolon', text: '; ', icon: ';' },
    { label: 'Dash', text: ' - ', icon: '—' },
    { label: 'Quote', text: '"', icon: '"' },
    { label: 'Single Quote', text: "'", icon: "'" },
    { label: 'Parentheses', text: '()', icon: '()' },
    { label: 'Brackets', text: '[]', icon: '[]' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-slate-200">Insert</span>
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
        <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="p-2 border-b border-slate-600">
            <h4 className="text-sm font-medium text-slate-200">Insert Formatting</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {formatOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  onInsertText(option.text);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-700 transition-colors text-slate-200 flex items-center justify-between"
                title={option.label}
              >
                <span>{option.label}</span>
                <span className="text-lg text-slate-400">{option.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
