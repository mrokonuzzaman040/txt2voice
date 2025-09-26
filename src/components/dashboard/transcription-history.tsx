'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { TranscriptionMode, TranscriptionProvider } from '@prisma/client';

type TranscriptionResponse = {
  id: string;
  mode: TranscriptionMode;
  provider: TranscriptionProvider;
  status: string;
  transcript: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
  };
};

export function TranscriptionHistory({
  showUser,
  query,
}: {
  showUser?: boolean;
  query?: string;
}) {
  const [items, setItems] = useState<TranscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const response = await fetch(`/api/transcriptions${query ? `?${query}` : ''}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load transcriptions.');
        }

        const payload = (await response.json()) as TranscriptionResponse[];
        setItems(payload);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [query]);

  return (
    <Card className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent transcripts</h2>
          <p className="text-sm text-slate-300">Latest 50 completions stored securely in Postgres.</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-200">Synced</Badge>
      </div>

      {loading && <p className="text-sm text-slate-300">Loading…</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
              <span>{new Date(item.createdAt).toLocaleString()}</span>
              <span>•</span>
              <span>{item.mode}</span>
              <span>•</span>
              <span>{item.provider}</span>
              <span>•</span>
              <span className={item.status === 'completed' ? 'text-emerald-300' : 'text-amber-300'}>
                {item.status}
              </span>
              {showUser && item.user && (
                <span className="text-indigo-200">
                  • {item.user.name ?? item.user.email ?? 'Unknown user'}
                </span>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-base text-white/90">
              {item.transcript ?? 'Transcript pending…'}
            </p>
          </div>
        ))}

        {!loading && items.length === 0 && !error && (
          <p className="text-sm text-slate-300">No transcriptions yet.</p>
        )}
      </div>
    </Card>
  );
}
