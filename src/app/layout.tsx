import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google"; //
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prokit.uk'),
  title: {
    default: "ProKit - Professional Developer Tools",
    template: "%s | ProKit"
  },
  description: "A suite of high-performance developer tools for AI, Security, and DNS.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prokit.uk',
    siteName: 'ProKit',
  },
  // Optional: Add this if you want to verify ownership via meta tag instead of file upload
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100`}>
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        {/* Replace 'GA_MEASUREMENT_ID' with your actual ID (e.g., G-XXXXXXXXXX) */}
        <GoogleAnalytics gaId="G-8BD9FQ2S2H" /> 
      </body>
    </html>
  );
}
