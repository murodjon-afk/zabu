
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const Unbounded = localFont({
  src: "../public/fonts/Unbounded-Regular.ttf",
  variable: "--f-display",
  weight: "400",
  display: "swap",
});

const Manrope = localFont({
  src: "../public/fonts/Manrope.ttf",
  variable: "--f-sans",
  weight: "200 800",
  display: "swap",
});

const Inter = localFont({
  src: "../public/fonts/Inter-Regular.otf",
  variable: "--f-tech",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZABU — Учись без границ",
  description: "Изучай языки вместе с ZABU",

  applicationName: "ZABU",

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    title: "ZABU",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
  },

icons: {
  icon: "/app-logo.png",
  apple: "/app-logo.png",
},
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${Unbounded.variable} ${Manrope.variable} ${Inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <Providers >{children}</Providers>
      </body>
    </html>
  );
}
