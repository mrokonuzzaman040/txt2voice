import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AppFooter } from '@/components/layout/footer';
import { MarketingNavbar } from '@/components/layout/navbar';
import { SessionProvider } from '@/components/providers/session-provider';
import { getCurrentSession } from '@/lib/session';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bengali Voice-to-Text Platform',
  description:
    'Secure, real-time Bengali voice-to-text workspace with AI-powered transcription for admins and creators.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0f1729] text-slate-100 antialiased`}
      >
        <SessionProvider session={session}>
          <MarketingNavbar session={session} />
          {children}
          <AppFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
