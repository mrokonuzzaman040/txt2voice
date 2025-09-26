'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Workspace' },
  { href: '/dashboard/history', label: 'History' },
  { href: '/admin', label: 'Admin', role: 'ADMIN' as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-300/80">Txt2Voice Studio</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Intelligent Voice Workspace</h1>
          <p className="mt-1 text-sm text-slate-300">
            {data?.user ? `Signed in as ${data.user.email}` : 'Collaborative real-time and recorded transcription.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {navItems
            .filter((item) => !item.role || item.role === data?.user.role)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full border border-transparent px-4 py-2 text-sm font-medium tracking-wide text-slate-200 transition hover:text-white',
                  pathname.startsWith(item.href) && 'border-indigo-400/60 bg-indigo-500/20 text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mt-8 flex flex-1 flex-col gap-8">{children}</main>
    </div>
  );
}
