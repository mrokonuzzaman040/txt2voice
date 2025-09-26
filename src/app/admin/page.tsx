import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { TranscriptionHistory } from '@/components/dashboard/transcription-history';
import prisma from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const [userCount, transcriptionCount, realtimeCount, recordedCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.transcription.count(),
    prisma.transcription.count({ where: { mode: 'REALTIME' } }),
    prisma.transcription.count({ where: { mode: 'RECORDED' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <AppShell>
      <section className="grid gap-6">
        <header>
          <h2 className="text-2xl font-semibold text-white">Admin control</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-300">
            Monitor usage, audit transcripts, and manage user access with enforced security controls.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          {[{ label: 'Total users', value: userCount }, { label: 'Total transcripts', value: transcriptionCount }, { label: 'Live sessions', value: realtimeCount }, { label: 'Recorded jobs', value: recordedCount }].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-200">Recent accounts</h3>
          <div className="grid gap-3 text-sm text-slate-200">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{user.name ?? 'Unnamed user'}</p>
                  <p className="text-xs text-slate-400">{user.email ?? 'No email'}</p>
                </div>
                <div className="text-right text-xs uppercase tracking-wide text-slate-400">
                  <p className="text-indigo-200">{user.role}</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <p>No users yet.</p>}
          </div>
        </div>

        <TranscriptionHistory showUser query="take=100" />
      </section>
    </AppShell>
  );
}
