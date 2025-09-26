import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

const features = [
  {
    title: 'Realtime Studio',
    description: 'Stream live speech directly from the browser with instant syncing to your workspace.',
  },
  {
    title: 'Batch Transcription',
    description: 'Upload recordings for Gemini or OpenAI processing with structured audit logs in Postgres.',
  },
  {
    title: 'Security & Control',
    description: 'NextAuth, Prisma, and role-based policies keep data safe for both admins and creators.',
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 py-20">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Badge className="bg-indigo-500/20 text-indigo-100">Voice Intelligence Platform</Badge>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Transform voice into actionable text in real time and at scale.
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Txt2Voice combines streaming transcription, recorded audio processing, and admin-grade
            compliance into a single secure workspace powered by Gemini or OpenAI.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-transparent bg-indigo-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              Launch workspace
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:text-white"
            >
              Create secure account
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-transparent to-slate-900 p-8 shadow-[0_40px_120px_-60px_rgba(45,124,255,0.6)]">
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-indigo-500/40 blur-3xl" />
          <div className="relative space-y-6 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Control Center</p>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">Session Monitor</p>
              <p className="text-sm text-slate-300">
                AI-engine: <span className="text-white">Auto (Gemini ↔ OpenAI)</span>
              </p>
              <p className="text-sm text-slate-300">
                Encryption: <span className="text-white">End-to-end</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Live transcript</p>
              <p className="mt-3 text-base text-slate-200">
                “Good morning team, today we roll out the multilingual voice automation stack across the
                compliance desk.”
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Last upload</p>
              <p className="mt-3 text-sm text-slate-300">Call_Review_0426.wav → Completed in 42s</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-white">Built for modern operations</h2>
          <p className="max-w-3xl text-base text-slate-300">
            From rapid call centers to compliance rooms, Txt2Voice provides a single pane of glass for
            capturing insights, annotating transcripts, and enforcing policy.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
