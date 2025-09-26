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

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isServiceBlocked, setIsServiceBlocked] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);
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

  useEffect(() => {
    if (!SpeechRecognitionImpl) {
      return;
    }

    const recognition = new SpeechRecognitionImpl() as SpeechRecognitionLike;
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Don't start automatically - only when explicitly requested

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult) {
        return;
      }

      let combined = '';
      for (let i = 0; i < event.results.length; i += 1) {
        combined += event.results[i][0]?.transcript ?? '';
      }

      setTranscript(combined);
    };

    recognition.onerror = (event) => {
      // Only handle errors if user has actually attempted to start
      if (!hasAttemptedStart) {
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
        if (retryCount < 2 && !isStarting) {
          setError(`Speech service connection issue. Retrying... (${retryCount + 1}/2)`);
          setRetryCount(prev => prev + 1);
          setIsStarting(true);
          
          // Retry with exponential backoff
          const delay = Math.min(2000 * Math.pow(2, retryCount), 8000);
          retryTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && !isRecording) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Failed to restart recognition:', err);
                setError('Unable to restart speech recognition. The service appears to be blocked.');
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
          setError('Speech recognition service is blocked or unavailable. This is likely due to network restrictions, firewall settings, or browser security policies.');
          setIsServiceBlocked(true);
        }
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking again.');
      } else if (event.error === 'audio-capture') {
        setError('Audio capture failed. Please check your microphone and try again.');
      } else if (event.error === 'service-not-allowed') {
        setError('Speech recognition service not available. Please try again later.');
        setIsServiceBlocked(true);
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
      setIsStarting(false);
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
  }, [SpeechRecognitionImpl]);

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
    setIsServiceBlocked(false);
    setIsStarting(true);
    setHasAttemptedStart(true); // Mark that user has attempted to start
    
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition. Please check your browser permissions and try again.');
      setIsStarting(false);
    }
  };

  const stop = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    recognitionRef.current?.stop();
    setIsRecording(false);
    setIsStarting(false);
  };

  const reset = () => {
    setHasAttemptedStart(false);
    setError(null);
    setRetryCount(0);
    setIsServiceBlocked(false);
    setIsStarting(false);
    setIsRecording(false);
    setTranscript('');
  };

  const supported = Boolean(SpeechRecognitionImpl);

  return {
    transcript,
    start,
    stop,
    reset,
    isRecording,
    supported,
    error,
    isServiceBlocked,
  };
}
