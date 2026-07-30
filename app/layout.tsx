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

const KOBE_IMAGE = "/images/kobe.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Kobe's Christening & 1st Birthday",

  description:
    "Join us as we celebrate the Christening and 1st Birthday of Kobe Rustyn Mayores on February 14, 2027.",

  applicationName: "Kobe's Online Invitation",

  creator: "Creatiq Digital Solutions",
  publisher: "Creatiq Digital Solutions",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: KOBE_IMAGE,
    shortcut: KOBE_IMAGE,
    apple: KOBE_IMAGE,
  },

  openGraph: {
    title: "Kobe's Christening & 1st Birthday",

    description:
      "Join us for Kobe Rustyn Mayores' Christening and 1st Birthday on February 14, 2027.",

    url: "/",
    siteName: "Kobe's Online Invitation",
    locale: "en_PH",
    type: "website",

    images: [
      {
        url: KOBE_IMAGE,
        alt: "Kobe Rustyn Mayores",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Kobe's Christening & 1st Birthday",

    description:
      "Join us for Kobe Rustyn Mayores' Christening and 1st Birthday on February 14, 2027.",

    images: [KOBE_IMAGE],
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
