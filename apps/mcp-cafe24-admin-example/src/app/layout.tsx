import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MCP Cafe24 Admin Example',
    default: 'MCP Cafe24 Admin Example',
  },
  description: 'A robust Next.js 16 application demonstrating Cafe24 Admin integration with MCP (Model Context Protocol). Features secure authentication, modern UI, and comprehensive admin tools.',
  keywords: ['Next.js', 'Cafe24', 'Admin', 'MCP', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Gracefullight', url: 'https://github.com/gracefullight' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://mcp-cafe24-admin-example.vercel.app',
    title: 'MCP Cafe24 Admin Example',
    description: 'Build powerful e-commerce admin tools with Next.js and Cafe24.',
    siteName: 'MCP Cafe24 Admin Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Cafe24 Admin Example',
    description: 'Build powerful e-commerce admin tools with Next.js and Cafe24.',
    creator: '@gracefullight',
  },
  icons: {
    icon: '/favicon.ico',
  },
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
