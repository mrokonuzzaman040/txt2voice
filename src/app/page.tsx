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
  {
    title: 'Analytics & QA',
    description: 'Powerful filters, exports, and dashboards give teams clarity over every conversion.',
  },
];

const stats = [
  { value: '45+', label: 'Languages supported in live capture' },
  { value: '200ms', label: 'Average streaming latency' },
  { value: '99.9%', label: 'Uptime with automated failover' },
  { value: 'SOC2', label: 'Security controls mapped and audited' },
];

const workflow = [
  {
    title: 'Capture',
    detail:
      'Browser speech recognition kicks off instantly, buffering audio for fallbacks and AI routing.',
  },
  {
    title: 'Transcribe',
    detail:
      'Audio is streamed to Gemini or OpenAI with prompt injection safeguards and profanity filters.',
  },
  {
    title: 'Enrich',
    detail:
      'Metadata, speaker hints, and custom vocabularies are applied before the transcript is stored.',
  },
  {
    title: 'Review',
    detail:
      'Admins audit transcripts, export summaries, and trigger downstream automations securely.',
  },
];

const securityHighlights = [
  'Data encrypted in transit and at rest with automatic rotation.',
  'Role-based policies with admin overrides and session tracing.',
  'Regional data residency options backed by PostgreSQL.',
  'SAML, SCIM, and hardware key support on enterprise tiers.',
];

const plans = [
  {
    name: 'Growth',
    price: '$49',
    cadence: 'per workspace / month',
    highlights: ['5 seats included', '10k minutes transcription', 'Email support', 'Workflow templates'],
  },
  {
    name: 'Scale',
    price: '$149',
    cadence: 'per workspace / month',
    highlights: [
      'Unlimited seats',
      'Priority Gemini + OpenAI routing',
      'Advanced analytics & exports',
      'Slack & Teams notifications',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Let’s talk',
    cadence: 'custom engagement',
    highlights: ['Dedicated region & VPC', 'On-premise connectors', 'SOC2 / HIPAA mapping', '24/7 support'],
  },
];

const faqs = [
  {
    question: 'Do you support multiple AI providers?',
    answer:
      'Yes. Txt2Voice dynamically routes audio to Gemini, OpenAI, or an on-premise engine based on policy, cost, and availability.',
  },
  {
    question: 'Can I import historical recordings?',
    answer:
      'Bulk upload jobs accept WAV, MP3, and M4A. You can automate ingestion with the REST API or S3-compatible storage.',
  },
  {
    question: 'How do you secure sensitive transcripts?',
    answer:
      'All data is encrypted with per-tenant keys. Admins can enforce data retention limits, watermark exports, and monitor access logs.',
  },
  {
    question: 'Is there an on-premise option?',
    answer:
      'Enterprise plans include self-hosted deployment blueprints, SSO, and hybrid routing to keep audio inside your network.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 py-24">
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
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
              </div>
            ))}
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

      <section id="features" className="grid gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-white">Built for modern operations</h2>
          <p className="max-w-3xl text-base text-slate-300">
            From rapid call centers to compliance rooms, Txt2Voice provides a single pane of glass for
            capturing insights, annotating transcripts, and enforcing policy.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="grid gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-white">How Txt2Voice fits your stack</h2>
          <p className="max-w-3xl text-base text-slate-300">
            A guided pipeline keeps teams aligned from capture through review while preserving governance
            every step of the way.
          </p>
        </div>
        <ol className="relative grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 before:absolute before:left-[1.15rem] before:top-12 before:h-[calc(100%-4rem)] before:w-px before:bg-indigo-500/30 md:grid-cols-2 md:before:hidden">
          {workflow.map((step, index) => (
            <li key={step.title} className="relative pl-12 md:pl-0">
              <span className="absolute left-0 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo-400/60 bg-indigo-500/20 text-sm font-semibold text-indigo-200 md:static md:mb-4">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-white md:mt-0">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="security" className="grid gap-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
        <div className="space-y-3">
          <Badge className="bg-emerald-500/20 text-emerald-100">Security Architecture</Badge>
          <h2 className="text-3xl font-semibold text-white">Defense-grade controls out of the box</h2>
          <p className="max-w-3xl text-base text-emerald-100/80">
            Every deployment inherits hardened defaults, detailed audit logs, and configurable retention
            policies so sensitive audio stays where it belongs.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {securityHighlights.map((item) => (
            <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-emerald-50/90">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="pricing" className="grid gap-10">
        <div className="space-y-3 text-center">
          <Badge className="bg-indigo-500/20 text-indigo-100">Flexible pricing</Badge>
          <h2 className="text-3xl font-semibold text-white">Scale from pilot to enterprise</h2>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            Choose a plan that matches your compliance posture and throughput. Upgrade instantly as your
            voice workloads grow.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">{plan.name}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white">{plan.price}</span>
                <span className="text-xs uppercase tracking-wide text-slate-400">{plan.cadence}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                {plan.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-sm font-semibold text-white transition hover:border-indigo-400 hover:bg-indigo-500/20"
              >
                Talk to sales
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faqs" className="grid gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-white">Frequently asked questions</h2>
          <p className="max-w-2xl text-base text-slate-300">
            Everything you need to know about Txt2Voice, from AI routing to compliance and deployment
            options.
          </p>
        </div>
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-2 rounded-2xl border border-white/10 bg-[#0f1729]/60 p-5">
              <p className="text-sm font-semibold text-white">{faq.question}</p>
              <p className="text-sm text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/30 via-transparent to-emerald-500/20 p-8 text-center">
        <h2 className="text-3xl font-semibold text-white">Deploy Txt2Voice in your team today</h2>
        <p className="mx-auto max-w-2xl text-base text-slate-200">
          Start with real-time capture, invite your analysts, and unlock deeper automation with our open
          APIs and policy-driven routing.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-transparent bg-white px-6 text-sm font-semibold text-indigo-600 shadow-lg shadow-indigo-500/30 transition hover:bg-slate-100"
          >
            Start free trial
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition hover:border-indigo-400 hover:text-indigo-100"
          >
            Explore documentation
          </Link>
        </div>
      </section>
    </main>
  );
}
