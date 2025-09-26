'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError('Complete all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to create account.');
      }

      setSuccess('Account created. You can sign in now.');
      setTimeout(() => {
        router.push('/sign-in');
      }, 1200);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm text-slate-300">
        Full name
        <Input
          placeholder="Alex Johnson"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
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
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      {success && <p className="text-sm text-emerald-300">{success}</p>}
      <Button type="submit" loading={loading} disabled={loading}>
        Create account
      </Button>
    </form>
  );
}
