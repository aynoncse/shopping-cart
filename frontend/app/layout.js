import Navbar from '@/components/Navbar';
import './globals.css';
import { Providers } from './providers';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ToasterProvider from '@/components/ToasterProvider';

export const metadata = {
  title: 'Shopping Cart',
  description: 'Full Stack Shopping Cart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Providers>
            <Navbar />
            <main className="container mx-auto px-4 grow">{children}</main>
            <Footer />
            <CartDrawer />
            <ToasterProvider />
          </Providers>
        </div>
      </body>
    </html>
  );
}
