'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { cn } from '@/lib/utils';

const links = [
  { href: '/#features', label: 'Features' },
  { href: '/#workflow', label: 'Workflow' },
  { href: '/#security', label: 'Security' },
  { href: '/#pricing', label: 'Plans' },
  { href: '/#faqs', label: 'FAQ' },
];

export function MarketingNavbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isWorkspaceRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  if (isWorkspaceRoute) {
    return null;
  }

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f1729]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200"
          onClick={close}
        >
          <span className="h-8 w-8 rounded-xl bg-indigo-500/20" />
          Txt2Voice
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <>
              <Link
                href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800 px-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-transparent bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              >
                Create account
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:border-indigo-400 hover:text-white md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className={cn('block h-0.5 w-5 bg-current transition', open && 'translate-y-1.5 rotate-45')} />
          <span className={cn('mt-1 block h-0.5 w-5 bg-current transition', open && 'opacity-0')} />
          <span className={cn('mt-1 block h-0.5 w-5 bg-current transition', open && '-translate-y-1.5 -rotate-45')} />
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#0f1729] px-4 py-6 md:hidden">
          <nav className="grid gap-4 text-sm text-slate-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-transparent px-3 py-2 transition hover:border-indigo-400/40 hover:bg-indigo-500/10"
                onClick={close}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3">
            {session?.user ? (
              <>
                <Link
                  href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={close}
                  className="inline-flex h-10 items-center justify-start rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    signOut({ callbackUrl: '/' });
                  }}
                  className="inline-flex h-10 items-center justify-start rounded-xl border border-white/10 bg-slate-800 px-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={close}
                  className="inline-flex h-10 items-center justify-start rounded-xl border border-white/10 bg-transparent px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={close}
                  className="inline-flex h-10 items-center justify-start rounded-xl border border-transparent bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
