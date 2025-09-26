'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TranscriptionProvider } from '@prisma/client';
import type { TranscriptionProviderConfig } from '@/lib/transcription/types';

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

export function RecordedPanel({
  providers,
}: {
  providers: TranscriptionProviderConfig[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [provider, setProvider] = useState<TranscriptionProvider | 'auto'>('auto');

  const configuredProviders = providers
    .filter((item) => item.isConfigured)
    .map((item) => item.provider);

  const selectableProviders = configuredProviders.length
    ? configuredProviders
    : providers.map((item) => item.provider);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const candidate = event.target.files?.[0];
    if (!candidate) {
      return;
    }

    if (candidate.size > MAX_SIZE) {
      setStatus('Please choose an audio file under 25MB.');
      return;
    }

    setFile(candidate);
    setStatus(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setStatus('Select an audio file to transcribe.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (prompt) {
      formData.append('prompt', prompt);
    }
    if (provider !== 'auto') {
      formData.append('provider', provider);
    }

    setLoading(true);
    setStatus('Uploading audio…');

    try {
      const response = await fetch('/api/transcriptions/recorded', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to transcribe audio.');
      }

      const payload = await response.json();
      setResult(payload.text);
      setStatus(`Completed using ${payload.provider}.`);
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="grid gap-6" data-panel="recorded">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Recorded audio</h2>
          <p className="text-sm text-slate-300">
            Upload MP3, WAV, or M4A files. Choose an AI engine or let the platform decide.
          </p>
        </div>
        <Badge className="bg-slate-800 text-slate-200">Batch mode</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="grid gap-2 text-sm text-slate-300">
          Audio file
          <Input type="file" accept="audio/*" onChange={handleFileChange} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Provider
          <select
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-indigo-400 focus:outline-none"
            value={provider}
            onChange={(event) => setProvider(event.target.value as typeof provider)}
          >
            <option value="auto">Auto select</option>
            {selectableProviders.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {configuredProviders.length === 0 && (
            <p className="text-xs text-amber-300">
              No AI provider detected. Configure OPENAI or GEMINI keys to enable server-side transcription.
            </p>
          )}
        </label>
      </div>

      <label className="grid gap-2 text-sm text-slate-300">
        Prompt (optional)
        <Textarea
          rows={3}
          placeholder="Accent guidance, vocabulary lists, or special instructions."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSubmit} loading={loading} disabled={loading}>
          Transcribe audio
        </Button>
        {status && <p className="text-sm text-slate-300">{status}</p>}
      </div>

      {result && (
        <div className="grid gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
            Transcript
          </p>
          <Textarea value={result} readOnly rows={6} className="min-h-[200px]" />
        </div>
      )}
    </Card>
  );
}
