import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#d97706',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Vite & Gourmand | Traiteur Événementiel Bordeaux',
    template: '%s | Vite & Gourmand',
  },
  description:
    'Traiteur événementiel à Bordeaux. Menus raffinés pour mariages, anniversaires, séminaires et tous vos événements. Livraison et service compris.',
  keywords: [
    'traiteur',
    'Bordeaux',
    'événementiel',
    'mariage',
    'séminaire',
    'repas',
    'livraison',
    'menu',
    'traiteur Bordeaux',
    'traiteur événementiel Gironde',
  ],
  authors: [{ name: 'Vite & Gourmand' }],
  metadataBase: new URL('https://vite-et-gourmand-rust.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Vite & Gourmand',
    title: 'Vite & Gourmand | Traiteur Événementiel Bordeaux',
    description:
      'Traiteur événementiel à Bordeaux. Menus raffinés livrés directement chez vous.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vite & Gourmand - Traiteur Événementiel Bordeaux',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://vite-et-gourmand-api.vercel.app" />
        <link rel="dns-prefetch" href="https://vite-et-gourmand-api.vercel.app" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
