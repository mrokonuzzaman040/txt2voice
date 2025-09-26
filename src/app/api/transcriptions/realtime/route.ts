import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { TranscriptionMode } from '@prisma/client';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { resolveProvider } from '@/lib/transcription';

const bodySchema = z.object({
  transcript: z.string().min(1, 'Transcript text is required.'),
  durationSec: z.number().optional(),
  provider: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const payload = bodySchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: payload.error.flatten().formErrors.join('\n') },
      { status: 400 },
    );
  }

  const resolvedProvider = resolveProvider(payload.data.provider);

  const transcription = await prisma.transcription.create({
    data: {
      userId: session.user.id,
      mode: TranscriptionMode.REALTIME,
      provider: resolvedProvider,
      status: 'completed',
      transcript: payload.data.transcript,
      durationSec: payload.data.durationSec,
    },
  });

  return NextResponse.json({ id: transcription.id });
}
