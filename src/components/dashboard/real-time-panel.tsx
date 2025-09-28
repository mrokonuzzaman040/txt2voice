'use client';

import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DemoInstructions } from '@/components/ui/demo-instructions';
import { LanguageSelector } from '@/components/ui/language-selector';
import { TextFormattingToolbar } from '@/components/ui/text-formatting-toolbar';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

export function RealTimePanel() {
  const { transcript, start, stop, reset, isRecording, supported, error, isServiceBlocked, currentLanguage, setLanguage } = useSpeechRecognition();
  const [status, setStatus] = useState<string>('Idle');
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Handle hydration by ensuring we only show the correct state after client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let animationId: number | null = null;

    const tick = () => {
      if (startTimeRef.current) {
        const seconds = (performance.now() - startTimeRef.current) / 1000;
        setDuration(seconds);
        animationId = requestAnimationFrame(tick);
      }
    };

    if (isRecording) {
      startTimeRef.current = performance.now();
      animationId = requestAnimationFrame(tick);
    } else {
      startTimeRef.current = null;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRecording]);

  const handleStart = () => {
    if (!supported) {
      setStatus('Speech recognition is not supported in this browser.');
      return;
    }
    if (!isOnline) {
      setStatus('No internet connection. Speech recognition requires an internet connection to work.');
      return;
    }
    setStatus('Listening... Speak in Bengali and your words will appear here.');
    start();
  };

  const handleInsertText = (text: string) => {
    // This would need to be enhanced to actually insert text at cursor position
    // For now, we'll append to the transcript
    const newTranscript = transcript + text;
    // Note: This is a simplified implementation. In a real editor, you'd want cursor positioning
  };

  const handleStop = async () => {
    stop();
    setStatus('Saving session…');

    if (!transcript.trim()) {
      setStatus('Nothing captured. Try again.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/transcriptions/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          durationSec: Number(duration.toFixed(1)),
          provider: supported ? 'local' : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to persist transcript.');
      }

      setStatus('Session stored successfully.');
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="grid gap-6">
      <DemoInstructions 
        isRecording={isRecording} 
        supported={supported} 
        isClient={isClient} 
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Bengali Voice Typing</h2>
          <p className="text-sm text-slate-300">
            Speak in Bengali and see your words appear instantly, just like Google Docs voice typing. Start speaking to begin dictation.
            {!supported && isClient && (
              <span className="block mt-1 text-xs text-amber-300">
                Speech recognition requires Chrome, Edge, or Safari. Try refreshing the page or using a different browser.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {supported && isClient && (
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={setLanguage}
              className="min-w-[180px]"
            />
          )}
          <Badge className={`${!isClient ? 'bg-slate-500/20 text-slate-300' : !isOnline ? 'bg-amber-500/20 text-amber-200' : supported ? 'bg-indigo-500/20 text-indigo-200' : 'bg-rose-500/20 text-rose-200'}`}>
            {!isClient ? 'Loading...' : !isOnline ? 'Offline' : supported ? 'Live ready' : 'Not supported'}
          </Badge>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3">
          <p className="text-sm text-rose-300">{error}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {error.includes('Network connection issue') && (
              <button
                onClick={handleStart}
                className="text-xs text-rose-200 underline hover:text-rose-100"
              >
                Try again
              </button>
            )}
            {error.includes('requires an internet connection') && (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-rose-200 underline hover:text-rose-100"
                >
                  Refresh page
                </button>
                <button
                  onClick={handleStart}
                  className="text-xs text-rose-200 underline hover:text-rose-100"
                >
                  Try again
                </button>
              </>
            )}
            {error.includes('Unable to restart speech recognition') && (
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-rose-200 underline hover:text-rose-100"
              >
                Refresh page
              </button>
            )}
            {error.includes('Language') && error.includes('not supported') && (
              <button
                onClick={handleStart}
                className="text-xs text-rose-200 underline hover:text-rose-100"
              >
                Try with fallback language
              </button>
            )}
          </div>
        </div>
      )}

      {error && error.includes('Speech recognition service is unavailable') && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="text-sm font-medium text-amber-200 mb-2">Troubleshooting Tips:</p>
          <ul className="text-xs text-amber-300 space-y-1">
            <li>• Ensure you&apos;re using Chrome, Edge, or Safari (Firefox doesn&apos;t support speech recognition)</li>
            <li>• Check if your firewall or antivirus is blocking the speech recognition service</li>
            <li>• Try disabling browser extensions that might interfere</li>
            <li>• Make sure you&apos;re not in a private/incognito mode</li>
            <li>• Check if your organization has blocked speech recognition services</li>
          </ul>
        </div>
      )}

      {!isRecording && !isServiceBlocked && supported && isClient && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm font-medium text-green-200 mb-2">💡 Bengali Voice Typing Tips:</p>
          <ul className="text-xs text-green-300 space-y-1">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Say punctuation marks: "comma", "period", "question mark"</li>
            <li>• Say "new paragraph" to start a new paragraph</li>
            <li>• Say "new line" to start a new line</li>
            <li>• The system will automatically continue listening until you stop</li>
          </ul>
        </div>
      )}

      {isServiceBlocked && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-sm font-medium text-blue-200 mb-2">Alternative Options:</p>
          <p className="text-xs text-blue-300 mb-3">
            Since real-time speech recognition is blocked, you can use the &quot;Recorded Audio&quot; panel below to upload audio files for transcription.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => document.querySelector('[data-panel="recorded"]')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs bg-blue-500/20 text-blue-200 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors"
            >
              Go to Recorded Audio
            </button>
            <button
              onClick={() => {
                reset();
                window.location.reload();
              }}
              className="text-xs bg-slate-500/20 text-slate-200 px-3 py-1 rounded hover:bg-slate-500/30 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <Textarea
          value={transcript}
          readOnly
          rows={12}
          className="min-h-[400px] resize-none text-base leading-relaxed font-mono bg-slate-900/50 border-slate-600 focus:border-blue-500 placeholder-slate-500"
          placeholder={
            isRecording 
              ? "Listening... Speak in Bengali and your words will appear here..."
              : "Click 'Start Dictation' and speak in Bengali. Your words will appear here in real-time, just like Google Docs voice typing."
          }
        />
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-400 font-medium">Recording</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          {status}
        </div>
        <div className="text-sm text-slate-400">
          Duration: <span className="text-white">{duration.toFixed(1)}s</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button 
          onClick={handleStart} 
          disabled={isRecording || !isOnline || isServiceBlocked}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isServiceBlocked ? 'Service Unavailable' : isRecording ? 'Dictation Active' : 'Start Dictation'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleStop}
          disabled={!isRecording || isSaving}
          loading={isSaving}
        >
          {isSaving ? 'Saving...' : 'Stop & Save'}
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          disabled={isRecording || isSaving}
        >
          Clear Text
        </Button>
        <TextFormattingToolbar
          onInsertText={handleInsertText}
          disabled={isRecording || isSaving}
        />
      </div>
    </Card>
  );
}
