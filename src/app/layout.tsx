import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { SITE_CONFIG } from '@/lib/seo/metadataEngine';

const inter = Inter({ subsets: ['latin'] });

// Fallback site URL to avoid invalid URL errors during static page generation
const baseUrl = SITE_CONFIG?.url || 'https://student.onyxstacklabs.com';

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.siteName}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`),
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen`}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
