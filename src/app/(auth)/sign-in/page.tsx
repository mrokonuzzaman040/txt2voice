import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignInForm } from '@/components/auth/sign-in-form';
import { Card } from '@/components/ui/card';
import { getCurrentSession } from '@/lib/session';

export default async function SignInPage() {
  const session = await getCurrentSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-between gap-10 px-6 py-16">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Secure workspace</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Welcome back to Txt2Voice</h1>
        <p className="mt-3 text-base text-slate-300">
          Connect to your collaborative voice studio with enforced security, role-based access, and
          streaming transcription.
        </p>
      </div>
      <Card className="w-full max-w-md border-white/5 bg-slate-900/60 p-8">
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-xl font-semibold text-white">Sign in</h2>
          <p className="text-sm text-slate-400">Use your workspace credentials</p>
        </div>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account?{' '}
          <Link href="/sign-up" className="text-indigo-300 hover:text-indigo-200">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}
