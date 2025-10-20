import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brand Application - bright.blue',
  description: 'Apply for physical retail placement with bright.blue vending machine network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

