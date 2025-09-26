import { TranscriptionMode, TranscriptionProvider } from '@prisma/client';

export type TranscriptionInput = {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  prompt?: string;
};

export type TranscriptionPayload = {
  text: string;
  provider: TranscriptionProvider;
  mode: TranscriptionMode;
  raw?: unknown;
  durationSec?: number;
};

export interface TranscriptionProviderConfig {
  provider: TranscriptionProvider;
  isConfigured: boolean;
}
