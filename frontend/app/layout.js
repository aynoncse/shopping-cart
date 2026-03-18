import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Shopping Cart',
  description: 'Full Stack Shopping Cart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
