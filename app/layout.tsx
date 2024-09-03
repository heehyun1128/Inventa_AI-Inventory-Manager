import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";


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
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "black", colorBackground: "#F6F4EB" },
      }}
    >
    <html lang="en" className={`${playfairDisplay.variable}`}>
    
      <body>{children}</body>
    </html>

    </ClerkProvider>
  );
}
