import { TranscriptionMode, TranscriptionProvider } from '@prisma/client';

import { transcribeWithGemini } from './gemini';
import { transcribeWithOpenAI } from './openai';
import type { TranscriptionInput, TranscriptionPayload, TranscriptionProviderConfig } from './types';

const providerMap: Record<TranscriptionProvider, () => boolean> = {
  [TranscriptionProvider.OPENAI]: () => Boolean(process.env.OPENAI_API_KEY),
  [TranscriptionProvider.GEMINI]: () => Boolean(process.env.GEMINI_API_KEY),
  [TranscriptionProvider.LOCAL]: () => true,
};

export function getConfiguredProviders(): TranscriptionProviderConfig[] {
  return (Object.values(TranscriptionProvider) as TranscriptionProvider[]).map(
    (provider) => ({
      provider,
      isConfigured: providerMap[provider](),
    }),
  );
}

export function resolveProvider(preferred?: string): TranscriptionProvider {
  if (preferred) {
    const normalized = preferred.toUpperCase() as TranscriptionProvider;
    if (providerMap[normalized]?.()) {
      return normalized;
    }
  }

  const envValue = process.env.PRIMARY_TRANSCRIPTION_PROVIDER;
  if (envValue) {
    const normalized = envValue.toUpperCase() as TranscriptionProvider;
    if (providerMap[normalized]?.()) {
      return normalized;
    }
  }

  if (providerMap[TranscriptionProvider.OPENAI]()) {
    return TranscriptionProvider.OPENAI;
  }

  if (providerMap[TranscriptionProvider.GEMINI]()) {
    return TranscriptionProvider.GEMINI;
  }

  return TranscriptionProvider.LOCAL;
}

export async function transcribeAudio(
  input: TranscriptionInput,
  mode: TranscriptionMode,
  preferredProvider?: string,
): Promise<TranscriptionPayload> {
  const provider = resolveProvider(preferredProvider);

  switch (provider) {
    case TranscriptionProvider.OPENAI:
      return transcribeWithOpenAI(input, mode);
    case TranscriptionProvider.GEMINI:
      return transcribeWithGemini(input, mode);
    case TranscriptionProvider.LOCAL:
    default:
      throw new Error('Local transcription provider is not implemented on the server.');
  }
}
