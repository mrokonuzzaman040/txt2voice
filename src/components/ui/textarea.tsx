import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
