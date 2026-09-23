import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FYP+C - Gestão Dinâmica',
  description: 'Plataforma de gestão integrada acadêmica e corporativa da FYP+C com EduSystem ERP',
  openGraph: {
    title: 'FYP+C - Gestão Dinâmica',
    description: 'Plataforma de gestão integrada acadêmica e corporativa da FYP+C com EduSystem ERP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
