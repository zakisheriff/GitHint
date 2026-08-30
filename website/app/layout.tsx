import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
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
  metadataBase: new URL('https://githint.theatom.lk'),
  title: {
    default: 'GitHint — Local Git Commit Message Generator',
    template: '%s | GitHint',
  },
  description:
    'Generate clean Conventional Commit messages from staged Git changes. Free, offline, private, and built without AI.',
  applicationName: 'GitHint',
  authors: [{ name: 'Zaki Sheriff', url: 'https://github.com/zakisheriff' }],
  creator: 'Zaki Sheriff',
  publisher: 'The Atom',
  category: 'Developer Tools',
  keywords: [
    'Git commit message generator',
    'Conventional Commits CLI',
    'offline Git tool',
    'local commit message generator',
    'GitHint',
    'githint',
    'developer CLI',
    'non-AI developer tool',
  ],
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/' },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'GitHint',
    title: 'GitHint — Your diff already knows the message',
    description:
      'A free, local, non-AI CLI that generates clean Conventional Commit suggestions from staged Git changes.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'GitHint — Your diff already knows the message.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHint — Your diff already knows the message',
    description:
      'Generate clean Git commit messages locally, privately, and without AI.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
