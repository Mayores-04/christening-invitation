import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://kobe-christening-invitation.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Kobe's Christening & 1st Birthday",
    template: "%s | Kobe's Celebration",
  },

  description:
    "Join us as we celebrate the Christening and 1st Birthday of Kobe Rustyn Mayores on February 14, 2027.",

  applicationName: "Kobe's Online Invitation",

  keywords: [
    "Kobe Rustyn Mayores",
    "Christening invitation",
    "First birthday invitation",
    "Online invitation",
    "Adventure birthday theme",
  ],

  authors: [
    {
      name: "Creatiq Digital Solutions",
    },
  ],

  creator: "Creatiq Digital Solutions",
  publisher: "Creatiq Digital Solutions",

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: "Kobe's Christening & 1st Birthday",
    description:
      "Join us for Kobe Rustyn Mayores' Christening and 1st Birthday on February 14, 2027.",
    url: SITE_URL,
    siteName: "Kobe's Online Invitation",
    locale: "en_PH",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kobe's Christening & 1st Birthday",
    description:
      "Join us for Kobe Rustyn Mayores' Christening and 1st Birthday on February 14, 2027.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-PH"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full overflow-x-hidden bg-[#f7f1df] font-sans text-[#304739]">
        {children}
      </body>
    </html>
  );
}
