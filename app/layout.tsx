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

export const metadata: Metadata = {
  title: "Kobe's Christening & 1st Birthday",
  description:
    "Join us as we celebrate the Christening and 1st Birthday of Kobe Rustyn Mayores.",

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

  icons: {
    icon: [
      {
        url: "/images/kobe.jpg",
        type: "image/jpeg",
      },
    ],
    shortcut: "/images/kobe.jpg",
    apple: "/images/kobe.jpg",
  },

  openGraph: {
    title: "Kobe's Christening & 1st Birthday",
    description:
      "Please join us for a joyful little adventure as we celebrate Kobe's Christening and 1st Birthday.",
    type: "website",
    locale: "en_PH",
    siteName: "Kobe's Online Invitation",
    images: [
      {
        url: "/images/kobe.jpg",
        alt: "Kobe Rustyn Mayores",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kobe's Christening & 1st Birthday",
    description: "Join us as we celebrate Kobe's Christening and 1st Birthday.",
    images: ["/images/kobe.jpg"],
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
