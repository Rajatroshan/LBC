import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/core/providers';
import { PwaRegistrar } from '@/components/pwa/PwaRegistrar';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#EA580C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'LBC Mandap — Village Chanda & Community Accounts',
  description: '100% Khula Hisab - Transparent Village Chanda, Puja Mandap & Financial Management Portal',
  manifest: '/manifest.json',
  applicationName: 'LBC Mandap',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LBC Mandap',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LBC Mandap" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className={inter.className}>
        <AppProviders>
          {children}
          <PwaRegistrar />
        </AppProviders>
      </body>
    </html>
  );
}
