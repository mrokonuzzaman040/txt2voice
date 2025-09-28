'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    0: { transcript: string };
  }>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

// Supported languages with fallbacks (Bengali first as default)
const SUPPORTED_LANGUAGES = [
  'bn-BD', 'bn-IN', // Bengali (Bangladesh, India) - Primary languages
  'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-ZA',
  'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE', 'es-VE',
  'fr-FR', 'fr-CA', 'fr-CH', 'fr-BE',
  'de-DE', 'de-AT', 'de-CH',
  'it-IT', 'it-CH',
  'pt-BR', 'pt-PT',
  'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW', 'zh-HK',
  'ru-RU', 'ar-SA', 'hi-IN', 'th-TH', 'nl-NL', 'sv-SE', 'no-NO', 'da-DK', 'fi-FI',
  'pl-PL', 'tr-TR', 'cs-CZ', 'sk-SK', 'hu-HU', 'ro-RO', 'bg-BG', 'hr-HR', 'sl-SI',
  'et-EE', 'lv-LV', 'lt-LT', 'uk-UA', 'el-GR', 'he-IL', 'id-ID', 'ms-MY', 'vi-VN'
];

function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'bn-BD';
  
  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || 'bn-BD';
  
  // Check if the browser language is supported
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }
  
  // Try to find a fallback based on language prefix
  const langPrefix = browserLang.split('-')[0];
  const fallback = SUPPORTED_LANGUAGES.find(lang => lang.startsWith(langPrefix + '-'));
  
  // Default to Bengali (Bangladesh) if no match found
  return fallback || 'bn-BD';
}

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldRunRef = useRef(false);
  const isServiceBlockedRef = useRef(false);
  const hasAttemptedStartRef = useRef(false);
  const retryCountRef = useRef(0);
  const isRecordingRef = useRef(false);
  const isStartingRef = useRef(false);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isServiceBlocked, setIsServiceBlocked] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('bn-BD');
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const SpeechRecognitionImpl = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const candidate = window as typeof window & {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };

    return candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition ?? null;
  }, []);

  // Initialize language on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detectedLanguage = getBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
    }
  }, []);

  useEffect(() => {
    if (!SpeechRecognitionImpl || !currentLanguage) {
      return;
    }

    const recognition = new SpeechRecognitionImpl() as SpeechRecognitionLike;
    recognition.lang = currentLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      isRecordingRef.current = true;
      setIsStarting(false);
      isStartingRef.current = false;
    };

    recognition.onresult = (event) => {
      let combined = '';
      
      // Process all results to build the complete transcript
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result && result[0]) {
          combined += result[0].transcript;
          
          // Add space after each word for better readability (except for punctuation)
          const transcript = result[0].transcript;
          if (!transcript.match(/[.!?।,;:]$/)) {
            combined += ' ';
          }
        }
      }

      setTranscript(combined.trim());
    };

    recognition.onerror = (event) => {
      // Only handle errors if user has actually attempted to start
      if (!hasAttemptedStartRef.current) {
        console.log('Speech recognition error (ignored - not started by user):', event.error);
        return;
      }
      
      console.error('Speech recognition error:', event.error);
      
      // Clear any pending retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      // Handle specific error types more gracefully
      if (event.error === 'network') {
        if (retryCountRef.current < 2 && !isStartingRef.current) {
          const nextAttempt = retryCountRef.current + 1;
          setError(`Network connection issue. Retrying... (${nextAttempt}/2)`);
          setRetryCount((prev) => prev + 1);
          setIsStarting(true);

          // Retry with exponential backoff
          const delay = Math.min(2000 * Math.pow(2, retryCountRef.current), 8000);
          retryTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && !isRecordingRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Failed to restart recognition:', err);
                setError('Unable to restart speech recognition. Please check your internet connection and try again.');
                setIsServiceBlocked(true);
                setIsRecording(false);
                setIsStarting(false);
              }
            } else {
              setIsStarting(false);
            }
          }, delay);
          return;
        } else {
          setError('Speech recognition requires an internet connection. Please check your network connection and try again.');
          setIsServiceBlocked(true);
          isServiceBlockedRef.current = true;
          shouldRunRef.current = false;
        }
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access and try again.');
        isServiceBlockedRef.current = false;
        shouldRunRef.current = false;
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking again.');
      } else if (event.error === 'audio-capture') {
        setError('Audio capture failed. Please check your microphone and try again.');
      } else if (event.error === 'language-not-supported') {
        // Try to fallback to Bengali variants first, then English
        const currentLangIndex = SUPPORTED_LANGUAGES.indexOf(currentLanguage);
        if (currentLangIndex > 1) { // Skip bn-BD and bn-IN which are at index 0 and 1
          // Try Bengali variants first
          let fallbackLang = SUPPORTED_LANGUAGES.find(lang => lang.startsWith('bn-'));
          // If no Bengali fallback, try English
          if (!fallbackLang) {
            fallbackLang = SUPPORTED_LANGUAGES.find(lang => lang.startsWith('en-')) || 'bn-BD';
          }
          setCurrentLanguage(fallbackLang);
          setError(`Language ${currentLanguage} not supported. Switching to ${fallbackLang}. Please try again.`);
        } else {
          setError(`Language ${currentLanguage} is not supported by your browser. Please use Chrome, Edge, or Safari for better language support.`);
          setIsServiceBlocked(true);
          isServiceBlockedRef.current = true;
          shouldRunRef.current = false;
        }
      } else if (event.error === 'service-not-allowed') {
        setError('Speech recognition service not available. Please try again later.');
        setIsServiceBlocked(true);
        isServiceBlockedRef.current = true;
        shouldRunRef.current = false;
      } else if (event.error === 'aborted') {
        setError('Speech recognition was interrupted. Please try again.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      
      setIsRecording(false);
      setIsStarting(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      isRecordingRef.current = false;
      setIsStarting(false);
      isStartingRef.current = false;

      // Auto-restart recognition for continuous dictation (like Google Docs)
      if (shouldRunRef.current && !isServiceBlockedRef.current) {
        try {
          setIsStarting(true);
          isStartingRef.current = true;
          
          // Shorter delay for more responsive dictation
          setTimeout(() => {
            if (shouldRunRef.current && !isServiceBlockedRef.current) {
              try {
                recognition.start();
              } catch (restartErr) {
                console.error('Failed to restart recognition:', restartErr);
                setIsStarting(false);
                isStartingRef.current = false;
                // Don't set error here as it might be temporary
              }
            }
          }, 100); // Reduced from 250ms to 100ms for better responsiveness
        } catch (err) {
          console.error('Failed to resume speech recognition:', err);
          setError('Unable to resume speech recognition.');
          shouldRunRef.current = false;
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [SpeechRecognitionImpl, currentLanguage]);

  const start = () => {
    if (!recognitionRef.current || isRecording || isStarting) {
      return;
    }

    // Clear any pending retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setTranscript('');
    setError(null);
    setRetryCount(0);
    retryCountRef.current = 0;
    setIsServiceBlocked(false);
    isServiceBlockedRef.current = false;
    setIsStarting(true);
    isStartingRef.current = true;
    setHasAttemptedStart(true); // Mark that user has attempted to start
    hasAttemptedStartRef.current = true;
    shouldRunRef.current = true;

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      isRecordingRef.current = true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition. Please check your browser permissions and try again.');
      setIsStarting(false);
      isStartingRef.current = false;
      shouldRunRef.current = false;
    }
  };

  const stop = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    shouldRunRef.current = false;
    recognitionRef.current?.stop();
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsStarting(false);
    isStartingRef.current = false;
  };

  const reset = () => {
    setHasAttemptedStart(false);
    hasAttemptedStartRef.current = false;
    setError(null);
    setRetryCount(0);
    retryCountRef.current = 0;
    setIsServiceBlocked(false);
    isServiceBlockedRef.current = false;
    setIsStarting(false);
    isStartingRef.current = false;
    setIsRecording(false);
    isRecordingRef.current = false;
    setTranscript('');
    shouldRunRef.current = false;
  };

  const supported = Boolean(SpeechRecognitionImpl);

  useEffect(() => {
    isServiceBlockedRef.current = isServiceBlocked;
  }, [isServiceBlocked]);

  useEffect(() => {
    hasAttemptedStartRef.current = hasAttemptedStart;
  }, [hasAttemptedStart]);

  useEffect(() => {
    retryCountRef.current = retryCount;
  }, [retryCount]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isStartingRef.current = isStarting;
  }, [isStarting]);

  const setLanguage = (language: string) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
      setCurrentLanguage(language);
      setError(null);
      setIsServiceBlocked(false);
      isServiceBlockedRef.current = false;
    }
  };

  return {
    transcript,
    start,
    stop,
    reset,
    isRecording,
    supported,
    error,
    isServiceBlocked,
    currentLanguage,
    setLanguage,
  };
}
