import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { RealTimePanel } from '@/components/dashboard/real-time-panel';
import { RecordedPanel } from '@/components/dashboard/recorded-panel';
import { TranscriptionHistory } from '@/components/dashboard/transcription-history';
import { getConfiguredProviders } from '@/lib/transcription';
import { getCurrentSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const providers = getConfiguredProviders();

  return (
    <AppShell>
      <div className="grid gap-8 lg:grid-cols-2">
        <RealTimePanel />
        <RecordedPanel providers={providers} />
      </div>
      <TranscriptionHistory />
    </AppShell>
  );
}
