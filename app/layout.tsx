import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "Inventa",
  description: "Pantry Tracker App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable}`}>
    
      <body>{children}</body>
    </html>
  );
}
