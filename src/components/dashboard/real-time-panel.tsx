'use client';

import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

export function RealTimePanel() {
  const { transcript, start, stop, isRecording, supported, error } = useSpeechRecognition();
  const [status, setStatus] = useState<string>('Idle');
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle hydration by ensuring we only show the correct state after client mount
  useEffect(() => {
    setIsClient(true);
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
    setStatus('Recording…');
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
          </p>
        </div>
        <Badge className="bg-indigo-500/20 text-indigo-200">
          {!isClient ? 'Loading...' : supported ? 'Live ready' : 'Not supported'}
        </Badge>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

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
        <Button onClick={handleStart} disabled={isRecording}>
          Start session
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
