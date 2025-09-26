import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TranscriptionMode } from '@prisma/client';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const querySchema = z.object({
  mode: z.string().optional(),
  userId: z.string().optional(),
  take: z.coerce.number().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parse = querySchema.safeParse(Object.fromEntries(searchParams));

  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid query parameters.' }, { status: 400 });
  }

  const { mode, userId, take } = parse.data;
  const normalizedMode = mode
    ? (mode.toUpperCase() as TranscriptionMode)
    : undefined;

  const isValidMode = normalizedMode
    ? (Object.values(TranscriptionMode) as string[]).includes(normalizedMode)
    : true;

  if (!isValidMode) {
    return NextResponse.json({ error: 'Invalid transcription mode.' }, { status: 400 });
  }

  const where = {
    ...(normalizedMode ? { mode: normalizedMode } : {}),
    ...(session.user.role === 'ADMIN'
      ? userId
        ? { userId }
        : {}
      : { userId: session.user.id }),
  };

  const transcriptions = await prisma.transcription.findMany({
    where,
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: take ?? 50,
  });

  return NextResponse.json(transcriptions);
}
