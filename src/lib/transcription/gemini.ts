import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranscriptionMode, TranscriptionProvider } from '@prisma/client';

import type { TranscriptionInput, TranscriptionPayload } from './types';

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function transcribeWithGemini(
  input: TranscriptionInput,
  mode: TranscriptionMode,
): Promise<TranscriptionPayload> {
  if (!geminiClient) {
    throw new Error('Gemini client not configured. Set GEMINI_API_KEY.');
  }

  const model = geminiClient.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash-latest',
  });

  const result = await model.generateContent([
    {
      inlineData: {
        data: input.buffer.toString('base64'),
        mimeType: input.mimeType,
      },
    },
    {
      text:
        input.prompt ??
        'Transcribe the provided audio input into clear, punctuated text.',
    },
  ]);

  const response = await result.response;
  const text = response.text();

  return {
    text,
    provider: TranscriptionProvider.GEMINI,
    mode,
    raw: response,
  };
}
