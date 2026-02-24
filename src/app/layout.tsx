import { NavBar } from '@/components/nav-bar';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  title: 'PuffWise',
  description: 'Privacy-first nicotine usage tracking. All data stays on your device.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PuffWise',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
          <NavBar />
          <main className="flex-1 px-4 pb-24 pt-6 sm:pb-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
