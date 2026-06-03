import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weekend School',
  description: 'Weekend School Management System',
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
