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
  title: "Lin's World",
  description: "Lin's World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        <div className="flex-1">{children}</div>
        <footer className="mt-8 border-t border-gray-200 py-6 text-center text-sm bg-gray-50 text-gray-500">
          © 2017–2026 Levi Lin. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
