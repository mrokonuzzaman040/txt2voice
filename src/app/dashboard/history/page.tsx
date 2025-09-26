import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { TranscriptionHistory } from '@/components/dashboard/transcription-history';
import { getCurrentSession } from '@/lib/session';

export default async function HistoryPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <AppShell>
      <section className="grid gap-6">
        <header>
          <h2 className="text-2xl font-semibold text-white">History & analytics</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Review your real-time captures and batch uploads. Filter and export transcripts from the
            admin surface.
          </p>
        </header>
        <TranscriptionHistory />
      </section>
    </AppShell>
  );
}
