import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-indigo-500 hover:bg-indigo-400 focus-visible:ring-indigo-300 text-white',
  secondary:
    'bg-slate-800 hover:bg-slate-700 focus-visible:ring-slate-500 text-slate-100',
  ghost:
    'bg-transparent hover:bg-slate-800/60 focus-visible:ring-slate-500 text-slate-100',
  danger:
    'bg-rose-500 hover:bg-rose-400 focus-visible:ring-rose-300 text-white',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', loading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex h-11 min-w-[3rem] items-center justify-center gap-2 rounded-xl border border-white/5 px-5 text-sm font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      )}
      <span>{children}</span>
    </button>
  ),
);

Button.displayName = 'Button';
