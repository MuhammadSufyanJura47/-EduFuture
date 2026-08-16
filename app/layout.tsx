import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cpef.vercel.app/'),
  title: '中巴 EduFuture | AI-Powered Education for the Future Generation',
  description: 'Personalized AI learning pathways, skill-gap diagnosis, adaptive roadmaps, and career mentorship for students navigating future technology careers.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: '中巴 EduFuture | AI-Powered Education for the Future Generation',
    description: 'Understand → Diagnose → Guide → Develop → Prepare for the Future.',
    type: 'website',
    url: 'https://cpef.vercel.app/',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '中巴 EduFuture | AI-Powered Education for the Future Generation',
    description: 'Understand → Diagnose → Guide → Develop → Prepare for the Future.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-100 text-slate-900 antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
