import OpenAI from 'openai';

import type { TranscriptionInput, TranscriptionPayload } from './types';
import { TranscriptionMode, TranscriptionProvider } from '@prisma/client';

const openAIClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function transcribeWithOpenAI(
  input: TranscriptionInput,
  mode: TranscriptionMode,
): Promise<TranscriptionPayload> {
  if (!openAIClient) {
    throw new Error('OpenAI client not configured. Set OPENAI_API_KEY.');
  }

  const file = await OpenAI.toFile(input.buffer, input.filename, {
    type: input.mimeType,
  });

  const response = await openAIClient.audio.transcriptions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini-transcribe',
    file,
    prompt: input.prompt,
  });

  return {
    text: response.text,
    provider: TranscriptionProvider.OPENAI,
    mode,
    raw: response,
  };
}
