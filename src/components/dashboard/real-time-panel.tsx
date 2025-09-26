'use client';

import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

export function RealTimePanel() {
  const { transcript, start, stop, reset, isRecording, supported, error, isServiceBlocked } = useSpeechRecognition();
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
    setStatus('Starting recording...');
    start();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Real-time capture</h2>
          <p className="text-sm text-slate-300">
            Stream speech into clean text using the browser speech API and sync instantly.
            {!supported && isClient && (
              <span className="block mt-1 text-xs text-amber-300">
                Speech recognition requires Chrome, Edge, or Safari. Try refreshing the page or using a different browser.
              </span>
            )}
          </p>
        </div>
        <Badge className={`${!isClient ? 'bg-slate-500/20 text-slate-300' : !isOnline ? 'bg-amber-500/20 text-amber-200' : supported ? 'bg-indigo-500/20 text-indigo-200' : 'bg-rose-500/20 text-rose-200'}`}>
          {!isClient ? 'Loading...' : !isOnline ? 'Offline' : supported ? 'Live ready' : 'Not supported'}
        </Badge>
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

      <Textarea
        value={transcript}
        readOnly
        rows={6}
        className="min-h-[200px] resize-none"
        placeholder="Live transcript will appear here..."
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          {status}
        </div>
        <div className="text-sm text-slate-400">
          Duration: <span className="text-white">{duration.toFixed(1)}s</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleStart} disabled={isRecording || !isOnline || isServiceBlocked}>
          {isServiceBlocked ? 'Service Unavailable' : 'Start session'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleStop}
          disabled={!isRecording || isSaving}
          loading={isSaving}
        >
          Stop & save
        </Button>
      </div>
    </Card>
  );
}
