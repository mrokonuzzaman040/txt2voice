import {
  PrismaClient,
  Role,
  TranscriptionMode,
  TranscriptionProvider,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';

  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Administrator',
      role: Role.ADMIN,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: await hash('UserPass123!', 12),
      name: 'Demo User',
      role: Role.USER,
    },
  });

  await prisma.transcription.createMany({
    data: [
      {
        userId: demoUser.id,
        mode: TranscriptionMode.RECORDED,
        provider: TranscriptionProvider.OPENAI,
        status: 'completed',
        transcript: 'Welcome to the Voice to Text demo. Upload audio to get started.',
      },
      {
        userId: demoUser.id,
        mode: TranscriptionMode.REALTIME,
        provider: TranscriptionProvider.LOCAL,
        status: 'completed',
        transcript: 'Real-time session placeholder transcript.',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
