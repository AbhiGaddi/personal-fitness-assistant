import './globals.css';
import React from 'react';
import Header from '../components/Header';

export const metadata = {
  title: 'Personalized Fitness AI',
  description: 'Adaptive workout planning from your calendar availability'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50 font-sans text-gray-900 antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 rounded bg-brand-600 px-3 py-2 text-xs font-semibold text-white">Skip to content</a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 p-4 md:px-8 md:py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/60 py-6 text-xs text-gray-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 md:flex-row md:justify-between md:px-8">
        <p className="leading-tight">© {new Date().getFullYear()} Personalized Fitness AI. Privacy-first planning.</p>
        <div className="flex flex-wrap gap-4" aria-label="Footer links">
          <a href="/privacy" className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1">Privacy</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

