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
      setError(event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [SpeechRecognitionImpl]);

  const start = () => {
    if (!recognitionRef.current) {
      return;
    }

    setTranscript('');
    setError(null);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const supported = Boolean(SpeechRecognitionImpl);

  return {
    transcript,
    start,
    stop,
    isRecording,
    supported,
    error,
  };
}
