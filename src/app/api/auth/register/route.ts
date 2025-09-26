import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const bodySchema = z.object({
  name: z.string().min(2).max(64),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.nativeEnum(Role).optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parse = bodySchema.safeParse(json);

  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.flatten() },
      { status: 422 },
    );
  }

  const session = await getServerSession(authOptions);

  if (parse.data.role === Role.ADMIN && session?.user.role !== Role.ADMIN) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: parse.data.email },
  });

  if (existing) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
  }

  const passwordHash = await hash(parse.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parse.data.name,
      email: parse.data.email,
      passwordHash,
      role: parse.data.role ?? Role.USER,
    },
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
