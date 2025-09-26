import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { TranscriptionMode } from '@prisma/client';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { resolveProvider, transcribeAudio } from '@/lib/transcription';

const fileSchema = z.instanceof(Blob, { message: 'Audio file is required.' });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const prompt = formData.get('prompt')?.toString();
  const provider = formData.get('provider')?.toString();

  const parseResult = fileSchema.safeParse(file);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.issues[0]?.message ?? 'Invalid file upload.' },
      { status: 400 },
    );
  }

  const audioFile = parseResult.data as File;
  const buffer = Buffer.from(await audioFile.arrayBuffer());

  const resolvedProvider = resolveProvider(provider);

  const transcriptionRecord = await prisma.transcription.create({
    data: {
      userId: session.user.id,
      mode: TranscriptionMode.RECORDED,
      provider: resolvedProvider,
      status: 'processing',
      originalName: audioFile.name,
    },
  });

  try {
    const result = await transcribeAudio(
      {
        buffer,
        mimeType: audioFile.type || 'audio/mpeg',
        filename: audioFile.name || 'recording',
        prompt: prompt || undefined,
      },
      TranscriptionMode.RECORDED,
      provider,
    );

    await prisma.transcription.update({
      where: { id: transcriptionRecord.id },
      data: {
        status: 'completed',
        transcript: result.text,
        provider: result.provider,
        metadata: result.raw as Record<string, unknown> | undefined,
      },
    });

    return NextResponse.json({
      id: transcriptionRecord.id,
      text: result.text,
      provider: result.provider,
    });
  } catch (error) {
    await prisma.transcription.update({
      where: { id: transcriptionRecord.id },
      data: {
        status: 'failed',
        metadata: { error: (error as Error).message },
      },
    });

    console.error('[RECORDED_TRANSCRIPTION_ERROR]', error);

    return NextResponse.json(
      { error: 'Unable to transcribe audio. Please try again later.' },
      { status: 500 },
    );
  }
}
