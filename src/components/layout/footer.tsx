'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Workflow', href: '/#workflow' },
      { label: 'Security', href: '/#security' },
      { label: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Status', href: '/status' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export function AppFooter() {
  const pathname = usePathname();
  const isWorkspaceRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  if (isWorkspaceRoute) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-[#090f1f]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_2fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Txt2Voice</p>
          <p className="max-w-sm text-sm text-slate-300">
            Enterprise-grade voice intelligence that combines real-time capture, secure storage, and
            admin oversight in a single workspace.
          </p>
          <div className="flex gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Txt2Voice</span>
            <span>•</span>
            <Link href="/privacy" className="transition hover:text-slate-200">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="transition hover:text-slate-200">
              Terms
            </Link>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-sm font-semibold text-white">{column.title}</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'transition hover:text-white',
                        link.href.startsWith('/#') && 'hover:underline hover:underline-offset-4',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
