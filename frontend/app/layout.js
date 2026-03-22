import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Providers } from './providers';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ToasterProvider from '@/components/ToasterProvider';

// Optimize fonts using next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Shopping Cart',
  description:
    'A full-stack shopping cart application featuring Firebase authentication and resilient state management.',
  keywords: ['e-commerce', 'shopping cart', 'nextjs', 'laravel'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl grow px-3 sm:px-4 lg:px-6">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}
