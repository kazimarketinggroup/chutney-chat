import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { PageTransition } from '@/components/PageTransition';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chutney & Chat - Award-Winning Business Networking',
  description: 'Informal, Educational & Connection - Award-winning business networking events with great speakers and 3-course Balti meals.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

import { TicketModalProvider } from '@/components/TicketModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans antialiased selection:bg-[#FF6600] selection:text-white">
        <TicketModalProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </TicketModalProvider>
      </body>
    </html>
  );
}
