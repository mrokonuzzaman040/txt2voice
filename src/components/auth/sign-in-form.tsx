'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm text-slate-300">
        Email
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        Password
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <Button type="submit" loading={loading} disabled={loading}>
        Sign in
      </Button>
    </form>
  );
}
