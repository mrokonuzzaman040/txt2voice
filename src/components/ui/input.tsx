import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
