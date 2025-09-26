import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_48px_-24px_rgba(88,101,242,0.45)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
