import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { Card } from '@/components/ui/card';
import { getCurrentSession } from '@/lib/session';

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-between gap-10 px-6 py-16">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Create workspace access</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Start transcribing in minutes</h1>
        <p className="mt-3 text-base text-slate-300">
          Launch real-time and recorded voice transcription with enterprise-grade security and admin
          oversight.
        </p>
      </div>
      <Card className="w-full max-w-md border-white/5 bg-slate-900/60 p-8">
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-xl font-semibold text-white">Create account</h2>
          <p className="text-sm text-slate-400">Provision a new user profile</p>
        </div>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link href="/sign-in" className="text-indigo-300 hover:text-indigo-200">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
