import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Student Portal — OnyxStack Labs',
  description: 'Enterprise Student SaaS Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-app-bg text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
