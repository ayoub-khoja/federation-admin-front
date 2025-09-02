import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTF Admin - Fédération Tunisienne de Football",
  description: "Interface d'administration de la Fédération Tunisienne de Football - Direction Arbitrage",
  icons: {
    icon: [
      { url: '/ftf-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/ftf-logo.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/ftf-logo.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/ftf-logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
